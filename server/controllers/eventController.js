import Event from '../models/Event.js';
import EventRegistration from '../models/EventRegistration.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { emitToAll, emitToUser } from '../config/socket.js';

// @desc    Get all events with filters & search
// @route   GET /api/events
// @access  Public
export const getEvents = async (req, res, next) => {
  try {
    const { category, status, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { organizer: { $regex: search, $options: 'i' } },
        { venue: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Event.countDocuments(query);
    const events = await Event.find(query)
      .populate('createdBy', 'name email avatar role')
      .sort({ date: 1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    // If user is authenticated via optional header/token, attach isRegistered flag
    let registeredEventIds = new Set();
    if (req.user) {
      const userRegs = await EventRegistration.find({ user: req.user._id, status: { $ne: 'Cancelled' } });
      registeredEventIds = new Set(userRegs.map(r => r.event.toString()));
    }

    const eventsWithReg = events.map(event => {
      const obj = event.toObject();
      obj.isRegistered = registeredEventIds.has(event._id.toString());
      return obj;
    });

    res.json({
      success: true,
      count: events.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      events: eventsWithReg,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
export const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'name email avatar role department');

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    let isRegistered = false;
    let myRegistration = null;

    if (req.user) {
      myRegistration = await EventRegistration.findOne({
        event: event._id,
        user: req.user._id,
        status: { $ne: 'Cancelled' }
      });
      if (myRegistration) isRegistered = true;
    }

    const registrations = await EventRegistration.find({ event: event._id, status: { $ne: 'Cancelled' } })
      .populate('user', 'name email avatar department role')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      event,
      isRegistered,
      myRegistration,
      participants: registrations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private (Faculty/Admin)
export const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      description,
      date,
      time,
      venue,
      organizer,
      category,
      bannerImage,
      registrationDeadline,
      maxParticipants,
      tags,
    } = req.body;

    const event = await Event.create({
      title,
      description,
      date,
      time,
      venue,
      organizer: organizer || req.user.name,
      category: category || 'Technical',
      bannerImage: bannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
      registrationDeadline,
      maxParticipants: maxParticipants || 100,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : ['Campus']),
      createdBy: req.user._id,
    });

    // Broadcast new event notification
    const notificationPayload = {
      title: 'New Campus Event Published! 🚀',
      message: `"${event.title}" scheduled for ${event.date} at ${event.venue}. Register now!`,
      type: 'event_registration',
      link: `/events/${event._id}`,
    };
    emitToAll('new_announcement', notificationPayload);

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Faculty/Admin/Creator)
export const updateEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (req.user.role !== 'admin' && event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this event' });
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: 'Event updated successfully',
      event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Faculty/Admin/Creator)
export const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (req.user.role !== 'admin' && event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this event' });
    }

    await EventRegistration.deleteMany({ event: event._id });
    await event.deleteOne();

    res.json({
      success: true,
      message: 'Event and associated registrations deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register for event
// @route   POST /api/events/:id/register
// @access  Private (Student)
export const registerForEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event.registeredCount >= event.maxParticipants) {
      return res.status(400).json({ success: false, message: 'Event is already fully booked' });
    }

    // Check existing registration
    const existing = await EventRegistration.findOne({
      event: event._id,
      user: req.user._id,
    });

    if (existing && existing.status !== 'Cancelled') {
      return res.status(400).json({ success: false, message: 'You are already registered for this event' });
    }

    const ticketNumber = `C1-TKT-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    let registration;
    if (existing && existing.status === 'Cancelled') {
      existing.status = 'Confirmed';
      existing.ticketNumber = ticketNumber;
      existing.registrationDate = new Date();
      await existing.save();
      registration = existing;
    } else {
      registration = await EventRegistration.create({
        event: event._id,
        user: req.user._id,
        ticketNumber,
        status: 'Confirmed',
      });
    }

    // Increment count
    event.registeredCount += 1;
    await event.save();

    // Create confirmation notification
    await Notification.create({
      recipient: req.user._id,
      title: 'Event Registration Confirmed! 🎟️',
      message: `You have successfully registered for "${event.title}". Ticket: ${ticketNumber}`,
      type: 'event_registration',
      link: `/events/${event._id}`,
    });

    emitToUser(req.user._id.toString(), 'new_notification', {
      title: 'Event Registration Confirmed! 🎟️',
      message: `You have registered for "${event.title}". Ticket: ${ticketNumber}`,
    });

    res.status(201).json({
      success: true,
      message: 'Successfully registered for the event',
      registration,
      registeredCount: event.registeredCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel event registration
// @route   POST /api/events/:id/cancel
// @access  Private (Student)
export const cancelRegistration = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const registration = await EventRegistration.findOne({
      event: event._id,
      user: req.user._id,
      status: 'Confirmed',
    });

    if (!registration) {
      return res.status(400).json({ success: false, message: 'No active registration found to cancel' });
    }

    registration.status = 'Cancelled';
    await registration.save();

    if (event.registeredCount > 0) {
      event.registeredCount -= 1;
      await event.save();
    }

    res.json({
      success: true,
      message: 'Event registration has been cancelled',
      registeredCount: event.registeredCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my registered events
// @route   GET /api/events/my-registrations
// @access  Private
export const getMyRegistrations = async (req, res, next) => {
  try {
    const registrations = await EventRegistration.find({
      user: req.user._id,
      status: 'Confirmed',
    })
      .populate({
        path: 'event',
        populate: { path: 'createdBy', select: 'name email avatar' },
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: registrations.length,
      registrations,
    });
  } catch (error) {
    next(error);
  }
};
