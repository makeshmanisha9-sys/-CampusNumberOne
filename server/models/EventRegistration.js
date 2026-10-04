import mongoose from 'mongoose';

const eventRegistrationSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  registrationDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['Confirmed', 'Waitlisted', 'Attended', 'Cancelled'],
    default: 'Confirmed',
  },
  ticketNumber: {
    type: String,
    unique: true,
  },
  notes: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

// Ensure a user can only register once for an event (unique compound index)
eventRegistrationSchema.index({ event: 1, user: 1 }, { unique: true });

export default mongoose.model('EventRegistration', eventRegistrationSchema);
