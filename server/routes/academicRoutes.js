import express from 'express';
import {
  getStudyMaterials,
  uploadStudyMaterial,
  deleteStudyMaterial,
  getAssignments,
  getAssignmentById,
  createAssignment,
  submitAssignment,
  gradeSubmission,
  getStudentAcademicOverview,
} from '../controllers/academicController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roles.js';

const router = express.Router();

router.use(protect);

// Materials
router.get('/materials', getStudyMaterials);
router.post('/materials', authorize('faculty', 'admin'), uploadStudyMaterial);
router.delete('/materials/:id', authorize('faculty', 'admin'), deleteStudyMaterial);

// Assignments
router.get('/assignments', getAssignments);
router.get('/assignments/:id', getAssignmentById);
router.post('/assignments', authorize('faculty', 'admin'), createAssignment);
router.post('/assignments/:id/submit', authorize('student'), submitAssignment);
router.post('/submissions/:id/grade', authorize('faculty', 'admin'), gradeSubmission);

// Overview / Attendance / Marks
router.get('/overview', getStudentAcademicOverview);

export default router;
