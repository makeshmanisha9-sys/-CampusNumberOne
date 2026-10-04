import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Assignment title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Assignment description is required'],
  },
  subject: {
    type: String,
    required: true,
  },
  subjectCode: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    default: 'Computer Science & Engineering',
  },
  semester: {
    type: Number,
    default: 6,
  },
  dueDate: {
    type: String, // e.g. 2026-10-10T23:59:59
    required: true,
  },
  maxMarks: {
    type: Number,
    default: 100,
  },
  attachmentUrl: {
    type: String,
    default: '',
  },
  attachmentName: {
    type: String,
    default: '',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['Active', 'Closed', 'Graded'],
    default: 'Active',
  },
}, {
  timestamps: true,
});

export default mongoose.model('Assignment', assignmentSchema);
