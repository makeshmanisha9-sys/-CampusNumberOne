import Achievement from '../models/Achievement.js';
import Notification from '../models/Notification.js';

// @desc    Get all achievements with filters
// @route   GET /api/achievements
// @access  Public
export const getAchievements = async (req, res, next) => {
  try {
    const { category, featured, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { issuer: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Achievement.countDocuments(query);
    const achievements = await Achievement.find(query)
      .populate('user', 'name email avatar department role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const achievementsWithLikes = achievements.map(a => {
      const obj = a.toObject();
      obj.isLiked = req.user ? a.likes.some(id => id.toString() === req.user._id.toString()) : false;
      obj.likeCount = a.likes.length;
      return obj;
    });

    res.json({
      success: true,
      count: achievements.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      achievements: achievementsWithLikes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my achievements
// @route   GET /api/achievements/my
// @access  Private
export const getMyAchievements = async (req, res, next) => {
  try {
    const achievements = await Achievement.find({ user: req.user._id })
      .populate('user', 'name email avatar department')
      .sort({ date: -1, createdAt: -1 });

    res.json({
      success: true,
      count: achievements.length,
      achievements,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new achievement
// @route   POST /api/achievements
// @access  Private (Student/Faculty)
export const createAchievement = async (req, res, next) => {
  try {
    const { title, description, category, date, issuer, certificateUrl, proofLink, featured } = req.body;

    const achievement = await Achievement.create({
      user: req.user._id,
      title,
      description,
      category,
      date: date || new Date().toISOString().split('T')[0],
      issuer: issuer || 'Campus Institution',
      certificateUrl: certificateUrl || 'https://images.unsplash.com/photo-1579389083078-4e7018379f7e?w=800&auto=format&fit=crop&q=80',
      proofLink: proofLink || '',
      featured: Boolean(featured),
    });

    const populated = await Achievement.findById(achievement._id)
      .populate('user', 'name email avatar department role');

    // Notify user
    await Notification.create({
      recipient: req.user._id,
      title: 'Achievement Added! 🏆',
      message: `Your achievement "${achievement.title}" has been successfully showcased on your profile.`,
      type: 'achievement_verified',
      link: '/achievements',
    });

    res.status(201).json({
      success: true,
      message: 'Achievement added successfully',
      achievement: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update achievement
// @route   PUT /api/achievements/:id
// @access  Private
export const updateAchievement = async (req, res, next) => {
  try {
    let achievement = await Achievement.findById(req.params.id);

    if (!achievement) {
      return res.status(404).json({ success: false, message: 'Achievement not found' });
    }

    if (req.user.role !== 'admin' && achievement.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this achievement' });
    }

    achievement = await Achievement.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('user', 'name email avatar department role');

    res.json({
      success: true,
      message: 'Achievement updated successfully',
      achievement,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete achievement
// @route   DELETE /api/achievements/:id
// @access  Private
export const deleteAchievement = async (req, res, next) => {
  try {
    const achievement = await Achievement.findById(req.params.id);

    if (!achievement) {
      return res.status(404).json({ success: false, message: 'Achievement not found' });
    }

    if (req.user.role !== 'admin' && achievement.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this achievement' });
    }

    await achievement.deleteOne();

    res.json({
      success: true,
      message: 'Achievement removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle like on achievement
// @route   POST /api/achievements/:id/like
// @access  Private
export const toggleLikeAchievement = async (req, res, next) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    if (!achievement) {
      return res.status(404).json({ success: false, message: 'Achievement not found' });
    }

    const isLiked = achievement.likes.some(id => id.toString() === req.user._id.toString());
    if (isLiked) {
      achievement.likes = achievement.likes.filter(id => id.toString() !== req.user._id.toString());
    } else {
      achievement.likes.push(req.user._id);
    }

    await achievement.save();

    res.json({
      success: true,
      isLiked: !isLiked,
      likeCount: achievement.likes.length,
    });
  } catch (error) {
    next(error);
  }
};
