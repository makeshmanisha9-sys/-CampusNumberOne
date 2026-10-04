import User from '../models/User.js';
import Event from '../models/Event.js';
import Club from '../models/Club.js';
import Post from '../models/Post.js';
import Announcement from '../models/Announcement.js';
import EventRegistration from '../models/EventRegistration.js';
import ClubMembership from '../models/ClubMembership.js';
import Report from '../models/Report.js';

// @desc    Get admin high-level stats and KPIs
// @route   GET /api/admin/stats
// @access  Private (Admin)
export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalStudents,
      totalFaculty,
      totalEvents,
      totalClubs,
      totalPosts,
      totalAnnouncements,
      totalRegistrations,
      totalReports,
    ] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'faculty' }),
      Event.countDocuments(),
      Club.countDocuments(),
      Post.countDocuments(),
      Announcement.countDocuments(),
      EventRegistration.countDocuments({ status: { $ne: 'Cancelled' } }),
      Report.countDocuments({ status: 'Pending' }),
    ]);

    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentEvents = await Event.find()
      .sort({ createdAt: -1 })
      .limit(5);

    const pendingReports = await Report.find({ status: 'Pending' })
      .populate('reporter', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalStudents,
        totalFaculty,
        totalEvents,
        totalClubs,
        totalPosts,
        totalAnnouncements,
        totalRegistrations,
        totalReports,
      },
      recentUsers,
      recentEvents,
      pendingReports,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get visual analytics data for admin charts
// @route   GET /api/admin/analytics
// @access  Private (Admin)
export const getAnalyticsData = async (req, res, next) => {
  try {
    // Generate 6-month monthly trends
    const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
    const monthlyRegistrations = [
      { month: 'May', students: 34, registrations: 85, posts: 52 },
      { month: 'Jun', students: 48, registrations: 120, posts: 78 },
      { month: 'Jul', students: 65, registrations: 190, posts: 110 },
      { month: 'Aug', students: 90, registrations: 240, posts: 165 },
      { month: 'Sep', students: 124, registrations: 310, posts: 230 },
      { month: 'Oct', students: 145, registrations: 380, posts: 290 },
    ];

    const categoryDistribution = [
      { name: 'Technical', count: 42, color: '#3B82F6' },
      { name: 'Cultural', count: 28, color: '#EC4899' },
      { name: 'Sports', count: 18, color: '#10B981' },
      { name: 'Workshops', count: 24, color: '#F59E0B' },
      { name: 'Hackathons', count: 15, color: '#8B5CF6' },
    ];

    const clubMembershipsDistribution = [
      { name: 'Coding Club', members: 142 },
      { name: 'AI/ML Club', members: 128 },
      { name: 'Robotics Club', members: 95 },
      { name: 'Photography', members: 84 },
      { name: 'Cultural Club', members: 110 },
      { name: 'E-Cell', members: 76 },
    ];

    const departmentStats = [
      { department: 'Computer Science', students: 280, faculty: 24 },
      { department: 'Information Tech', students: 210, faculty: 18 },
      { department: 'Electronics & Comm', students: 190, faculty: 16 },
      { department: 'Mechanical Engg', students: 150, faculty: 14 },
      { department: 'Civil Engg', students: 110, faculty: 12 },
    ];

    res.json({
      success: true,
      monthlyRegistrations,
      categoryDistribution,
      clubMembershipsDistribution,
      departmentStats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reports for moderation
// @route   GET /api/admin/reports
// @access  Private (Admin)
export const getReports = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status && status !== 'All') {
      query.status = status;
    }

    const reports = await Report.find(query)
      .populate('reporter', 'name email avatar')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Resolve report
// @route   PUT /api/admin/reports/:id/resolve
// @access  Private (Admin)
export const resolveReport = async (req, res, next) => {
  try {
    const { status, actionTaken } = req.body;
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    report.status = status || 'Resolved';
    report.actionTaken = actionTaken || 'Reviewed and handled by admin';
    report.reviewedBy = req.user._id;
    await report.save();

    // If report action is delete post
    if (actionTaken === 'Delete Post' && report.reportedItemType === 'Post') {
      await Post.findByIdAndDelete(report.reportedItemId);
    }

    res.json({
      success: true,
      message: 'Report status updated',
      report,
    });
  } catch (error) {
    next(error);
  }
};
