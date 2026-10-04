import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Achievement title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Achievement description is required'],
  },
  category: {
    type: String,
    enum: ['Hackathon', 'Internship', 'Certification', 'Project', 'Sports', 'Academic', 'Competition', 'Publication'],
    required: true,
  },
  date: {
    type: String, // e.g. 2026-08-20
    required: true,
  },
  issuer: {
    type: String,
    default: 'Campus Institution',
  },
  certificateUrl: {
    type: String,
    default: 'https://images.unsplash.com/photo-1579389083078-4e7018379f7e?w=800&auto=format&fit=crop&q=80',
  },
  proofLink: {
    type: String,
    default: '',
  },
  isVerified: {
    type: Boolean,
    default: true,
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  featured: {
    type: Boolean,
    default: false,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
}, {
  timestamps: true,
});

export default mongoose.model('Achievement', achievementSchema);
