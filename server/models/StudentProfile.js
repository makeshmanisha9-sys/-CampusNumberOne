import mongoose from 'mongoose';

const studentProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  rollNumber: {
    type: String,
    required: true,
    trim: true,
  },
  semester: {
    type: Number,
    default: 6,
  },
  batch: {
    type: String,
    default: '2023-2027',
  },
  cgpa: {
    type: Number,
    default: 8.8,
  },
  bio: {
    type: String,
    default: 'Aspiring Full Stack Engineer & Campus Tech Enthusiast',
  },
  skills: [{
    type: String,
  }],
  githubUrl: {
    type: String,
    default: '',
  },
  linkedinUrl: {
    type: String,
    default: '',
  },
  attendance: {
    overall: {
      type: Number,
      default: 88,
    },
    subjects: [{
      subjectName: String,
      subjectCode: String,
      attended: Number,
      total: Number,
      percentage: Number,
    }],
  },
  marks: [{
    subjectName: String,
    subjectCode: String,
    internal1: Number,
    internal2: Number,
    assignmentScore: Number,
    grade: String,
  }],
}, {
  timestamps: true,
});

export default mongoose.model('StudentProfile', studentProfileSchema);
