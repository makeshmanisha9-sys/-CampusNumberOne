import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
  },
  date: {
    type: String, // e.g. 2026-10-15
    required: [true, 'Event date is required'],
  },
  time: {
    type: String, // e.g. 10:00 AM - 4:00 PM
    required: [true, 'Event time is required'],
  },
  venue: {
    type: String,
    required: [true, 'Event venue is required'],
  },
  organizer: {
    type: String,
    required: true,
    default: 'Campus Tech Council',
  },
  category: {
    type: String,
    enum: ['Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar', 'Hackathon', 'Webinar', 'Career'],
    default: 'Technical',
  },
  bannerImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
  },
  registrationDeadline: {
    type: String,
    required: true,
  },
  maxParticipants: {
    type: Number,
    default: 100,
  },
  registeredCount: {
    type: Number,
    default: 0,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'],
    default: 'Upcoming',
  },
  tags: [{
    type: String,
  }],
}, {
  timestamps: true,
});

export default mongoose.model('Event', eventSchema);
