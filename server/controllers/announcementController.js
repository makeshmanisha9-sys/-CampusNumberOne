import Announcement from '../models/Announcement.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { emitToAll } from '../config/socket.js';

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Public
export const getAnnouncements = async (req, res, next) => {
  try {
    const { category, priority, isPinned, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    if (isPinned !== undefined && isPinned !== 'All') {
      query.isPinned = isPinned === 'true';
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Announcement.countDocuments(query);
    const announcements = await Announcement.find(query)
      .populate('author', 'name email avatar role department')
      .sort({ isPinned: -1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      count: announcements.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      announcements,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single announcement
// @route   GET /api/announcements/:id
// @access  Public
export const getAnnouncementById = async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
      .populate('author', 'name email avatar role department');

    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }

    res.json({
      success: true,
      announcement,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create announcement
// @route   POST /api/announcements
// @access  Private (Faculty/Admin)
export const createAnnouncement = async (req, res, next) => {
  try {
    const {
      title,
      content,
      category,
      priority,
      isPinned,
      targetAudience,
      attachments,
      department,
    } = req.body;

    const announcement = await Announcement.create({
      title,
      content,
      category: category || 'General',
      priority: priority || 'Normal',
      isPinned: Boolean(isPinned),
      targetAudience: targetAudience || 'All',
      attachments: attachments || [],
      department: department || req.user.department || 'All Departments',
      author: req.user._id,
    });

    const populated = await Announcement.findById(announcement._id)
      .populate('author', 'name email avatar role department');

    // Notify all active students and faculty
    const users = await User.find({ _id: { $ne: req.user._id } }, '_id');
    const notifications = users.map(u => ({
      recipient: u._id,
      sender: req.user._id,
      title: `Campus Announcement: ${announcement.title}`,
      message: announcement.content.substring(0, 100) + '...',
      type: 'announcement',
      link: '/announcements',
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    // Real-time socket broadcast
    emitToAll('new_announcement', {
      title: `Campus Announcement: ${announcement.title}`,
      message: announcement.content.substring(0, 100) + '...',
      type: 'announcement',
      announcement: populated,
    });

    res.status(201).json({
      success: true,
      message: 'Announcement published successfully',
      announcement: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update announcement
// @route   PUT /api/announcements/:id
// @access  Private (Faculty/Admin)
export const updateAnnouncement = async (req, res, next) => {
  try {
    let announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }

    if (req.user.role !== 'admin' && announcement.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this announcement' });
    }

    announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('author', 'name email avatar role department');

    res.json({
      success: true,
      message: 'Announcement updated successfully',
      announcement,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
// @access  Private (Faculty/Admin)
export const deleteAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }

    if (req.user.role !== 'admin' && announcement.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this announcement' });
    }

    await announcement.deleteOne();

    res.json({
      success: true,
      message: 'Announcement deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
