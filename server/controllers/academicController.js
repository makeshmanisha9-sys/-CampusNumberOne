import StudyMaterial from '../models/StudyMaterial.js';
import Assignment from '../models/Assignment.js';
import AssignmentSubmission from '../models/AssignmentSubmission.js';
import StudentProfile from '../models/StudentProfile.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { emitToAll, emitToUser } from '../config/socket.js';

// --- STUDY MATERIALS ---

// @desc    Get study materials with search and filters
// @route   GET /api/academics/materials
// @access  Public / Authenticated
export const getStudyMaterials = async (req, res, next) => {
  try {
    const { subject, semester, materialType, search } = req.query;
    const query = {};

    if (subject && subject !== 'All') {
      query.subject = subject;
    }

    if (semester && semester !== 'All') {
      query.semester = Number(semester);
    }

    if (materialType && materialType !== 'All') {
      query.materialType = materialType;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { subjectCode: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const materials = await StudyMaterial.find(query)
      .populate('uploadedBy', 'name email avatar role department')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: materials.length,
      materials,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload study material
// @route   POST /api/academics/materials
// @access  Private (Faculty/Admin)
export const uploadStudyMaterial = async (req, res, next) => {
  try {
    const { title, description, subject, subjectCode, department, semester, materialType, fileUrl, fileName, fileSize, tags } = req.body;

    const material = await StudyMaterial.create({
      title,
      description: description || '',
      subject,
      subjectCode,
      department: department || req.user.department || 'Computer Science & Engineering',
      semester: semester || 6,
      materialType: materialType || 'Lecture Notes',
      fileUrl: fileUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      fileName: fileName || `${title.toLowerCase().replace(/\s+/g, '_')}.pdf`,
      fileSize: fileSize || '2.8 MB',
      uploadedBy: req.user._id,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : [subjectCode]),
    });

    const populated = await StudyMaterial.findById(material._id)
      .populate('uploadedBy', 'name email avatar role department');

    // Notify students
    const students = await User.find({ role: 'student' }, '_id');
    const notifications = students.map(s => ({
      recipient: s._id,
      sender: req.user._id,
      title: `New Study Material: ${material.subjectCode}`,
      message: `"${material.title}" has been uploaded for ${material.subject}.`,
      type: 'study_material',
      link: '/academics',
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    emitToAll('new_announcement', {
      title: `New Study Material: ${material.subjectCode}`,
      message: `"${material.title}" uploaded by ${req.user.name}`,
    });

    res.status(201).json({
      success: true,
      message: 'Study material uploaded successfully',
      material: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete study material
// @route   DELETE /api/academics/materials/:id
// @access  Private (Faculty/Admin)
export const deleteStudyMaterial = async (req, res, next) => {
  try {
    const material = await StudyMaterial.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ success: false, message: 'Material not found' });
    }

    if (req.user.role !== 'admin' && material.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this material' });
    }

    await material.deleteOne();
    res.json({ success: true, message: 'Study material deleted' });
  } catch (error) {
    next(error);
  }
};

// --- ASSIGNMENTS ---

// @desc    Get assignments
// @route   GET /api/academics/assignments
// @access  Private
export const getAssignments = async (req, res, next) => {
  try {
    const { subject, status, semester } = req.query;
    const query = {};

    if (subject && subject !== 'All') query.subject = subject;
    if (status && status !== 'All') query.status = status;
    if (semester && semester !== 'All') query.semester = Number(semester);

    const assignments = await Assignment.find(query)
      .populate('createdBy', 'name email avatar department')
      .sort({ dueDate: 1 });

    // If student, attach my submission
    let mySubmissionsMap = {};
    if (req.user && req.user.role === 'student') {
      const submissions = await AssignmentSubmission.find({ student: req.user._id });
      submissions.forEach(sub => {
        mySubmissionsMap[sub.assignment.toString()] = sub;
      });
    }

    const assignmentsWithSub = assignments.map(a => {
      const obj = a.toObject();
      obj.mySubmission = mySubmissionsMap[a._id.toString()] || null;
      return obj;
    });

    res.json({
      success: true,
      count: assignments.length,
      assignments: assignmentsWithSub,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get assignment by ID with submissions (faculty) or my submission (student)
// @route   GET /api/academics/assignments/:id
// @access  Private
export const getAssignmentById = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('createdBy', 'name email avatar department');

    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    let mySubmission = null;
    let allSubmissions = [];

    if (req.user.role === 'student') {
      mySubmission = await AssignmentSubmission.findOne({
        assignment: assignment._id,
        student: req.user._id,
      });
    } else {
      // Faculty/Admin can view all submissions
      allSubmissions = await AssignmentSubmission.find({ assignment: assignment._id })
        .populate('student', 'name email avatar department')
        .sort({ submittedAt: -1 });
    }

    res.json({
      success: true,
      assignment,
      mySubmission,
      submissions: allSubmissions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create assignment
// @route   POST /api/academics/assignments
// @access  Private (Faculty/Admin)
export const createAssignment = async (req, res, next) => {
  try {
    const { title, description, subject, subjectCode, department, semester, dueDate, maxMarks, attachmentUrl, attachmentName } = req.body;

    const assignment = await Assignment.create({
      title,
      description,
      subject,
      subjectCode,
      department: department || req.user.department || 'Computer Science & Engineering',
      semester: semester || 6,
      dueDate,
      maxMarks: maxMarks || 100,
      attachmentUrl: attachmentUrl || '',
      attachmentName: attachmentName || '',
      createdBy: req.user._id,
    });

    // Notify students
    const students = await User.find({ role: 'student' }, '_id');
    const notifications = students.map(s => ({
      recipient: s._id,
      sender: req.user._id,
      title: `New Assignment: ${assignment.subjectCode}`,
      message: `"${assignment.title}" has been assigned. Due on ${new Date(assignment.dueDate).toLocaleDateString()}.`,
      type: 'assignment_new',
      link: '/academics',
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    res.status(201).json({
      success: true,
      message: 'Assignment created successfully',
      assignment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit assignment
// @route   POST /api/academics/assignments/:id/submit
// @access  Private (Student)
export const submitAssignment = async (req, res, next) => {
  try {
    const { submissionText, fileUrl, fileName } = req.body;
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    const existing = await AssignmentSubmission.findOne({
      assignment: assignment._id,
      student: req.user._id,
    });

    const isLate = new Date() > new Date(assignment.dueDate);
    const status = isLate ? 'Late' : 'Submitted';

    let submission;
    if (existing) {
      existing.submissionText = submissionText || existing.submissionText;
      existing.fileUrl = fileUrl || existing.fileUrl;
      existing.fileName = fileName || existing.fileName;
      existing.submittedAt = new Date();
      existing.status = status;
      await existing.save();
      submission = existing;
    } else {
      submission = await AssignmentSubmission.create({
        assignment: assignment._id,
        student: req.user._id,
        submissionText: submissionText || '',
        fileUrl: fileUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileName: fileName || `${req.user.name.replace(/\s+/g, '_')}_submission.pdf`,
        status,
      });
    }

    // Notify faculty creator
    await Notification.create({
      recipient: assignment.createdBy,
      sender: req.user._id,
      title: 'New Assignment Submission 📥',
      message: `${req.user.name} submitted assignment for ${assignment.title}.`,
      type: 'assignment_new',
      link: '/academics',
    });

    res.status(201).json({
      success: true,
      message: 'Assignment submitted successfully',
      submission,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Grade submission
// @route   POST /api/academics/submissions/:id/grade
// @access  Private (Faculty/Admin)
export const gradeSubmission = async (req, res, next) => {
  try {
    const { marksObtained, feedback } = req.body;
    const submission = await AssignmentSubmission.findById(req.params.id).populate('assignment');

    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    submission.marksObtained = marksObtained;
    submission.feedback = feedback || '';
    submission.status = 'Graded';
    submission.gradedBy = req.user._id;
    submission.gradedAt = new Date();
    await submission.save();

    // Notify student
    await Notification.create({
      recipient: submission.student,
      sender: req.user._id,
      title: 'Assignment Graded! 🎯',
      message: `Your submission for "${submission.assignment.title}" received ${marksObtained}/${submission.assignment.maxMarks} marks.`,
      type: 'assignment_graded',
      link: '/academics',
    });

    emitToUser(submission.student.toString(), 'new_notification', {
      title: 'Assignment Graded! 🎯',
      message: `Your submission received ${marksObtained}/${submission.assignment.maxMarks} marks.`,
    });

    res.json({
      success: true,
      message: 'Submission graded successfully',
      submission,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get student academic overview (attendance + marks)
// @route   GET /api/academics/overview
// @access  Private
export const getStudentAcademicOverview = async (req, res, next) => {
  try {
    let profile = await StudentProfile.findOne({ user: req.user._id });
    if (!profile) {
      return res.json({
        success: true,
        attendance: { overall: 88, subjects: [] },
        marks: [],
      });
    }

    res.json({
      success: true,
      attendance: profile.attendance,
      marks: profile.marks,
      cgpa: profile.cgpa,
      semester: profile.semester,
    });
  } catch (error) {
    next(error);
  }
};
