import mongoose from 'mongoose';

const studyMaterialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Material title is required'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  subject: {
    type: String,
    required: [true, 'Subject name is required'],
  },
  subjectCode: {
    type: String,
    required: [true, 'Subject code is required'],
    trim: true,
  },
  department: {
    type: String,
    default: 'Computer Science & Engineering',
  },
  semester: {
    type: Number,
    required: true,
    default: 6,
  },
  materialType: {
    type: String,
    enum: ['Lecture Notes', 'Syllabus', 'Question Bank', 'Lab Manual', 'Reference Book', 'Video Link', 'Presentation'],
    default: 'Lecture Notes',
  },
  fileUrl: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  fileSize: {
    type: String,
    default: '2.4 MB',
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  downloadsCount: {
    type: Number,
    default: 0,
  },
  tags: [{
    type: String,
  }],
}, {
  timestamps: true,
});

export default mongoose.model('StudyMaterial', studyMaterialSchema);
