import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Announcement title is required'],
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Announcement content is required'],
  },
  category: {
    type: String,
    enum: ['Academic', 'Examination', 'Placement', 'Events', 'General', 'Emergency'],
    default: 'General',
  },
  priority: {
    type: String,
    enum: ['Low', 'Normal', 'High', 'Urgent'],
    default: 'Normal',
  },
  isPinned: {
    type: Boolean,
    default: false,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  targetAudience: {
    type: String,
    enum: ['All', 'Students', 'Faculty', 'Final Year', 'First Year'],
    default: 'All',
  },
  attachments: [{
    fileName: String,
    fileUrl: String,
    fileType: String,
  }],
  department: {
    type: String,
    default: 'All Departments',
  },
  expiresAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Announcement', announcementSchema);
