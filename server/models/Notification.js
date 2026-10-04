import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: [
      'announcement',
      'event_registration',
      'event_reminder',
      'club_join',
      'club_announcement',
      'study_material',
      'assignment_new',
      'assignment_graded',
      'post_like',
      'post_comment',
      'achievement_verified',
      'general'
    ],
    default: 'general',
  },
  link: {
    type: String,
    default: '',
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
});

export default mongoose.model('Notification', notificationSchema);
