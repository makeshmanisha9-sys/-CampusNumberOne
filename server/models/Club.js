import mongoose from 'mongoose';

const clubSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Club name is required'],
    unique: true,
    trim: true,
  },
  category: {
    type: String,
    enum: ['Technical', 'Arts & Culture', 'Sports', 'Media & Photography', 'Literature', 'Innovation & E-Cell', 'Social Service'],
    default: 'Technical',
  },
  description: {
    type: String,
    required: [true, 'Club description is required'],
  },
  logo: {
    type: String,
    default: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&auto=format&fit=crop&q=80',
  },
  coverImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop&q=80',
  },
  facultyCoordinator: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    department: { type: String, default: 'Computer Science' },
  },
  studentLeader: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    rollNumber: { type: String, default: 'CS-2023-042' },
  },
  memberCount: {
    type: Number,
    default: 0,
  },
  meetingSchedule: {
    type: String,
    default: 'Every Wednesday 4:30 PM at Innovation Lab',
  },
  gallery: [{
    url: String,
    caption: String,
  }],
  announcements: [{
    title: String,
    content: String,
    date: { type: Date, default: Date.now },
  }],
  socialLinks: {
    instagram: { type: String, default: '' },
    github: { type: String, default: '' },
    discord: { type: String, default: '' },
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

export default mongoose.model('Club', clubSchema);
