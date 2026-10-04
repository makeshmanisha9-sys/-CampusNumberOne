import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import StudentProfile from '../models/StudentProfile.js';
import FacultyProfile from '../models/FacultyProfile.js';
import Notification from '../models/Notification.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'campus_number_one_super_secret_key_2026', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role = 'student', department, rollNumber, facultyId, phone } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email address',
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
      department: department || 'Computer Science & Engineering',
      phone: phone || '',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    });

    // Create corresponding profile
    if (role === 'student') {
      await StudentProfile.create({
        user: user._id,
        rollNumber: rollNumber || `CS-${Math.floor(1000 + Math.random() * 9000)}`,
        semester: 6,
        batch: '2023-2027',
        cgpa: 8.5,
        skills: ['React', 'Node.js', 'Python', 'Algorithms'],
        attendance: {
          overall: 88,
          subjects: [
            { subjectName: 'Distributed Systems', subjectCode: 'CS601', attended: 22, total: 25, percentage: 88 },
            { subjectName: 'Cloud Computing', subjectCode: 'CS602', attended: 20, total: 24, percentage: 83 },
            { subjectName: 'Machine Learning', subjectCode: 'CS603', attended: 26, total: 28, percentage: 92 },
            { subjectName: 'Software Engineering', subjectCode: 'CS604', attended: 24, total: 26, percentage: 92 },
          ]
        },
        marks: [
          { subjectName: 'Distributed Systems', subjectCode: 'CS601', internal1: 28, internal2: 27, assignmentScore: 19, grade: 'A+' },
          { subjectName: 'Cloud Computing', subjectCode: 'CS602', internal1: 25, internal2: 26, assignmentScore: 18, grade: 'A' },
          { subjectName: 'Machine Learning', subjectCode: 'CS603', internal1: 29, internal2: 30, assignmentScore: 20, grade: 'O' },
          { subjectName: 'Software Engineering', subjectCode: 'CS604', internal1: 27, internal2: 28, assignmentScore: 19, grade: 'A+' },
        ]
      });
    } else if (role === 'faculty') {
      await FacultyProfile.create({
        user: user._id,
        facultyId: facultyId || `FAC-${Math.floor(100 + Math.random() * 900)}`,
        designation: 'Assistant Professor',
        qualification: 'M.Tech, Ph.D. in Computer Science',
        officeLocation: 'Academic Block A, Room 305',
        officeHours: 'Mon-Fri 2:00 PM - 4:00 PM',
        specialization: ['Full Stack Development', 'Cloud Computing', 'AI'],
        subjectsTaught: ['CS601: Distributed Systems', 'CS602: Cloud Computing'],
      });
    }

    // Welcome Notification
    await Notification.create({
      recipient: user._id,
      title: 'Welcome to CampusNumberOne! 🎉',
      message: `Welcome ${user.name}! Explore upcoming campus events, join exciting student clubs, and connect with peers.`,
      type: 'general',
      link: '/dashboard',
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password',
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated by administrator',
      });
    }

    // Fetch profile if exists
    let profile = null;
    if (user.role === 'student') {
      profile = await StudentProfile.findOne({ user: user._id });
    } else if (user.role === 'faculty') {
      profile = await FacultyProfile.findOne({ user: user._id });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        avatar: user.avatar,
        phone: user.phone,
        profile,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    let profile = null;

    if (user.role === 'student') {
      profile = await StudentProfile.findOne({ user: user._id });
    } else if (user.role === 'faculty') {
      profile = await FacultyProfile.findOne({ user: user._id });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        avatar: user.avatar,
        phone: user.phone,
        profile,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const { name, department, phone, avatar, bio, skills, githubUrl, linkedinUrl, officeLocation, officeHours } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (department) user.department = department;
    if (phone !== undefined) user.phone = phone;
    if (avatar) user.avatar = avatar;

    await user.save();

    let profile = null;
    if (user.role === 'student') {
      profile = await StudentProfile.findOneAndUpdate(
        { user: user._id },
        {
          $set: {
            ...(bio !== undefined && { bio }),
            ...(skills !== undefined && { skills }),
            ...(githubUrl !== undefined && { githubUrl }),
            ...(linkedinUrl !== undefined && { linkedinUrl }),
          },
        },
        { new: true, upsert: true }
      );
    } else if (user.role === 'faculty') {
      profile = await FacultyProfile.findOneAndUpdate(
        { user: user._id },
        {
          $set: {
            ...(officeLocation !== undefined && { officeLocation }),
            ...(officeHours !== undefined && { officeHours }),
          },
        },
        { new: true, upsert: true }
      );
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        avatar: user.avatar,
        phone: user.phone,
        profile,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email address',
      });
    }

    res.json({
      success: true,
      message: 'Password reset instructions have been dispatched to your email address (Simulated in dev mode: use password123)',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.password = password;
    await user.save();

    res.json({
      success: true,
      message: 'Password has been reset successfully. You can now log in.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
export const logout = async (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
};
