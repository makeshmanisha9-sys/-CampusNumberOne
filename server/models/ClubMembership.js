import mongoose from 'mongoose';

const clubMembershipSchema = new mongoose.Schema({
  club: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  role: {
    type: String,
    enum: ['Member', 'Core Member', 'Coordinator', 'Lead'],
    default: 'Member',
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Pending'],
    default: 'Active',
  },
}, {
  timestamps: true,
});

clubMembershipSchema.index({ club: 1, user: 1 }, { unique: true });

export default mongoose.model('ClubMembership', clubMembershipSchema);
