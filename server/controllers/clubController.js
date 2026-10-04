import Club from '../models/Club.js';
import ClubMembership from '../models/ClubMembership.js';
import Notification from '../models/Notification.js';
import { emitToAll, emitToUser } from '../config/socket.js';

// @desc    Get all clubs
// @route   GET /api/clubs
// @access  Public
export const getClubs = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const clubs = await Club.find(query).sort({ memberCount: -1, createdAt: -1 });

    let userMemberships = new Set();
    if (req.user) {
      const memberships = await ClubMembership.find({ user: req.user._id, status: 'Active' });
      userMemberships = new Set(memberships.map(m => m.club.toString()));
    }

    const clubsWithMembership = clubs.map(club => {
      const obj = club.toObject();
      obj.isMember = userMemberships.has(club._id.toString());
      return obj;
    });

    res.json({
      success: true,
      count: clubs.length,
      clubs: clubsWithMembership,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single club details
// @route   GET /api/clubs/:id
// @access  Public
export const getClubById = async (req, res, next) => {
  try {
    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({ success: false, message: 'Club not found' });
    }

    let isMember = false;
    let membershipDetails = null;

    if (req.user) {
      membershipDetails = await ClubMembership.findOne({
        club: club._id,
        user: req.user._id,
        status: 'Active',
      });
      if (membershipDetails) isMember = true;
    }

    const members = await ClubMembership.find({ club: club._id, status: 'Active' })
      .populate('user', 'name email avatar department role')
      .sort({ joinedAt: -1 });

    res.json({
      success: true,
      club,
      isMember,
      membershipDetails,
      members,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new club
// @route   POST /api/clubs
// @access  Private (Admin / Faculty)
export const createClub = async (req, res, next) => {
  try {
    const {
      name,
      category,
      description,
      logo,
      coverImage,
      facultyCoordinator,
      studentLeader,
      meetingSchedule,
      socialLinks,
    } = req.body;

    const clubExists = await Club.findOne({ name });
    if (clubExists) {
      return res.status(400).json({ success: false, message: 'A club with this name already exists' });
    }

    const club = await Club.create({
      name,
      category: category || 'Technical',
      description,
      logo: logo || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&auto=format&fit=crop&q=80',
      coverImage: coverImage || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop&q=80',
      facultyCoordinator: facultyCoordinator || {
        name: req.user.name,
        email: req.user.email,
        department: req.user.department || 'Computer Science',
      },
      studentLeader: studentLeader || {
        name: 'Alex Rivera',
        email: 'alex.rivera@campus.edu',
        rollNumber: 'CS-2023-010',
      },
      meetingSchedule: meetingSchedule || 'Wednesdays at 4:30 PM',
      socialLinks: socialLinks || {},
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Club created successfully',
      club,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update club
// @route   PUT /api/clubs/:id
// @access  Private (Admin / Faculty)
export const updateClub = async (req, res, next) => {
  try {
    const club = await Club.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!club) {
      return res.status(404).json({ success: false, message: 'Club not found' });
    }

    res.json({
      success: true,
      message: 'Club details updated successfully',
      club,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete club
// @route   DELETE /api/clubs/:id
// @access  Private (Admin)
export const deleteClub = async (req, res, next) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) {
      return res.status(404).json({ success: false, message: 'Club not found' });
    }

    await ClubMembership.deleteMany({ club: club._id });
    await club.deleteOne();

    res.json({
      success: true,
      message: 'Club and all memberships deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Join club
// @route   POST /api/clubs/:id/join
// @access  Private (Student)
export const joinClub = async (req, res, next) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) {
      return res.status(404).json({ success: false, message: 'Club not found' });
    }

    const existing = await ClubMembership.findOne({
      club: club._id,
      user: req.user._id,
    });

    if (existing && existing.status === 'Active') {
      return res.status(400).json({ success: false, message: 'You are already a member of this club' });
    }

    let membership;
    if (existing) {
      existing.status = 'Active';
      existing.joinedAt = new Date();
      await existing.save();
      membership = existing;
    } else {
      membership = await ClubMembership.create({
        club: club._id,
        user: req.user._id,
        role: 'Member',
        status: 'Active',
      });
    }

    club.memberCount += 1;
    await club.save();

    // Create notification
    await Notification.create({
      recipient: req.user._id,
      title: 'Welcome to the Club! 🤝',
      message: `You are now a registered member of ${club.name}. Stay tuned for upcoming meetups and activities.`,
      type: 'club_join',
      link: `/clubs/${club._id}`,
    });

    res.status(201).json({
      success: true,
      message: `Successfully joined ${club.name}`,
      membership,
      memberCount: club.memberCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Leave club
// @route   POST /api/clubs/:id/leave
// @access  Private (Student)
export const leaveClub = async (req, res, next) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) {
      return res.status(404).json({ success: false, message: 'Club not found' });
    }

    const membership = await ClubMembership.findOne({
      club: club._id,
      user: req.user._id,
      status: 'Active',
    });

    if (!membership) {
      return res.status(400).json({ success: false, message: 'You are not an active member of this club' });
    }

    await membership.deleteOne();

    if (club.memberCount > 0) {
      club.memberCount -= 1;
      await club.save();
    }

    res.json({
      success: true,
      message: `Successfully left ${club.name}`,
      memberCount: club.memberCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my joined clubs
// @route   GET /api/clubs/my-clubs
// @access  Private
export const getMyClubs = async (req, res, next) => {
  try {
    const memberships = await ClubMembership.find({
      user: req.user._id,
      status: 'Active',
    }).populate('club');

    res.json({
      success: true,
      count: memberships.length,
      clubs: memberships.map(m => m.club),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add announcement to club
// @route   POST /api/clubs/:id/announcements
// @access  Private (Faculty/Admin/Club Lead)
export const addClubAnnouncement = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({ success: false, message: 'Club not found' });
    }

    club.announcements.unshift({
      title,
      content,
      date: new Date(),
    });

    await club.save();

    res.status(201).json({
      success: true,
      message: 'Club announcement posted successfully',
      announcements: club.announcements,
    });
  } catch (error) {
    next(error);
  }
};
