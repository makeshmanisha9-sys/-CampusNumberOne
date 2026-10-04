import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: [true, 'Post content is required'],
    trim: true,
  },
  images: [{
    type: String,
  }],
  category: {
    type: String,
    enum: ['General', 'Project', 'Question', 'Achievement', 'Campus Life', 'Resource', 'Opportunity'],
    default: 'General',
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  likeCount: {
    type: Number,
    default: 0,
  },
  commentCount: {
    type: Number,
    default: 0,
  },
  tags: [{
    type: String,
  }],
  isPinned: {
    type: Boolean,
    default: false,
  },
  isReported: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['Active', 'Hidden', 'Flagged'],
    default: 'Active',
  },
}, {
  timestamps: true,
});

export default mongoose.model('Post', postSchema);
