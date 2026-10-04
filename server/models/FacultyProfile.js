import mongoose from 'mongoose';

const facultyProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  facultyId: {
    type: String,
    required: true,
    trim: true,
  },
  designation: {
    type: String,
    default: 'Associate Professor',
  },
  qualification: {
    type: String,
    default: 'Ph.D. in Computer Science',
  },
  specialization: [{
    type: String,
  }],
  officeLocation: {
    type: String,
    default: 'Academic Block A, Room 402',
  },
  officeHours: {
    type: String,
    default: 'Mon-Thu 2:00 PM - 4:00 PM',
  },
  subjectsTaught: [{
    type: String,
  }],
  publicationsCount: {
    type: Number,
    default: 12,
  },
}, {
  timestamps: true,
});

export default mongoose.model('FacultyProfile', facultyProfileSchema);
