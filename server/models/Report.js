import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reportedItemType: {
    type: String,
    enum: ['Post', 'Comment', 'User', 'Event'],
    required: true,
  },
  reportedItemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  reason: {
    type: String,
    enum: ['Spam', 'Harassment', 'Inappropriate Content', 'Misinformation', 'Plagiarism', 'Other'],
    required: true,
  },
  details: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['Pending', 'Reviewed', 'Resolved', 'Dismissed'],
    default: 'Pending',
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  actionTaken: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

export default mongoose.model('Report', reportSchema);
