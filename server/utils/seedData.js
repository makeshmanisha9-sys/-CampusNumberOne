import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import StudentProfile from '../models/StudentProfile.js';
import FacultyProfile from '../models/FacultyProfile.js';
import Event from '../models/Event.js';
import EventRegistration from '../models/EventRegistration.js';
import Club from '../models/Club.js';
import ClubMembership from '../models/ClubMembership.js';
import Announcement from '../models/Announcement.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import Achievement from '../models/Achievement.js';
import StudyMaterial from '../models/StudyMaterial.js';
import Assignment from '../models/Assignment.js';
import AssignmentSubmission from '../models/AssignmentSubmission.js';
import Notification from '../models/Notification.js';
import Report from '../models/Report.js';

export const seedDatabase = async () => {
  try {
    console.log('🌱 Checking and seeding initial database records...');

    // Clear existing data to ensure clean slate
    await Promise.all([
      User.deleteMany({}),
      StudentProfile.deleteMany({}),
      FacultyProfile.deleteMany({}),
      Event.deleteMany({}),
      EventRegistration.deleteMany({}),
      Club.deleteMany({}),
      ClubMembership.deleteMany({}),
      Announcement.deleteMany({}),
      Post.deleteMany({}),
      Comment.deleteMany({}),
      Achievement.deleteMany({}),
      StudyMaterial.deleteMany({}),
      Assignment.deleteMany({}),
      AssignmentSubmission.deleteMany({}),
      Notification.deleteMany({}),
      Report.deleteMany({}),
    ]);

    console.log('🧹 Cleaned existing database collections');

    // 1. Create Users
    const adminUser = await User.create({
      name: 'Dr. Richard Henderson',
      email: 'admin@campus.edu',
      password: 'password123',
      role: 'admin',
      department: 'Campus Administration & Dean of Academic Affairs',
      phone: '+1 (555) 019-2834',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      isActive: true,
    });

    const facultyUser = await User.create({
      name: 'Prof. Sarah Jenkins',
      email: 'faculty@campus.edu',
      password: 'password123',
      role: 'faculty',
      department: 'Computer Science & Engineering',
      phone: '+1 (555) 018-9941',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      isActive: true,
    });

    const facultyUser2 = await User.create({
      name: 'Prof. Alan Turing',
      email: 'alan.turing@campus.edu',
      password: 'password123',
      role: 'faculty',
      department: 'Artificial Intelligence & Robotics',
      phone: '+1 (555) 014-7722',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      isActive: true,
    });

    const studentUser = await User.create({
      name: 'Alex Rivera',
      email: 'student@campus.edu',
      password: 'password123',
      role: 'student',
      department: 'Computer Science & Engineering',
      phone: '+1 (555) 012-3456',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
      isActive: true,
    });

    const studentUser2 = await User.create({
      name: 'Emma Watson',
      email: 'emma.watson@campus.edu',
      password: 'password123',
      role: 'student',
      department: 'Information Technology',
      phone: '+1 (555) 017-8833',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
      isActive: true,
    });

    const studentUser3 = await User.create({
      name: 'David Kim',
      email: 'david.kim@campus.edu',
      password: 'password123',
      role: 'student',
      department: 'Computer Science & Engineering',
      phone: '+1 (555) 011-4477',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
      isActive: true,
    });

    const studentUser4 = await User.create({
      name: 'Priya Sharma',
      email: 'priya.sharma@campus.edu',
      password: 'password123',
      role: 'student',
      department: 'Electronics & Communication',
      phone: '+1 (555) 016-5599',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
      isActive: true,
    });

    // 2. Profiles
    await StudentProfile.create({
      user: studentUser._id,
      rollNumber: 'CS-2023-042',
      semester: 6,
      batch: '2023-2027',
      cgpa: 9.15,
      bio: 'Full Stack MERN & Cloud Architect | Lead Organizer @ ByteCraft Coding Club | SIH 2026 Winner',
      skills: ['React', 'Node.js', 'Vite', 'MongoDB', 'Docker', 'AWS', 'Python', 'TailwindCSS', 'GraphQL'],
      githubUrl: 'https://github.com/alexrivera-tech',
      linkedinUrl: 'https://linkedin.com/in/alex-rivera-campus',
      attendance: {
        overall: 91,
        subjects: [
          { subjectName: 'Distributed Systems', subjectCode: 'CS601', attended: 26, total: 28, percentage: 93 },
          { subjectName: 'Cloud Computing & DevOps', subjectCode: 'CS602', attended: 24, total: 26, percentage: 92 },
          { subjectName: 'Deep Learning & AI', subjectCode: 'CS603', attended: 28, total: 30, percentage: 93 },
          { subjectName: 'Advanced Software Engineering', subjectCode: 'CS604', attended: 22, total: 25, percentage: 88 },
          { subjectName: 'Information & Network Security', subjectCode: 'CS605', attended: 23, total: 26, percentage: 88 },
        ]
      },
      marks: [
        { subjectName: 'Distributed Systems', subjectCode: 'CS601', internal1: 29, internal2: 28, assignmentScore: 20, grade: 'O' },
        { subjectName: 'Cloud Computing & DevOps', subjectCode: 'CS602', internal1: 28, internal2: 29, assignmentScore: 19, grade: 'A+' },
        { subjectName: 'Deep Learning & AI', subjectCode: 'CS603', internal1: 30, internal2: 30, assignmentScore: 20, grade: 'O' },
        { subjectName: 'Advanced Software Engineering', subjectCode: 'CS604', internal1: 27, internal2: 28, assignmentScore: 19, grade: 'A+' },
        { subjectName: 'Information & Network Security', subjectCode: 'CS605', internal1: 28, internal2: 27, assignmentScore: 19, grade: 'A+' },
      ]
    });

    await StudentProfile.create({
      user: studentUser2._id,
      rollNumber: 'IT-2023-018',
      semester: 6,
      batch: '2023-2027',
      cgpa: 8.85,
      bio: 'UI/UX Designer & Frontend enthusiast | Lead @ Aperture Photography Society',
      skills: ['Figma', 'React', 'TailwindCSS', 'Photoshop', 'TypeScript'],
      attendance: { overall: 89, subjects: [] },
      marks: [],
    });

    await FacultyProfile.create({
      user: facultyUser._id,
      facultyId: 'FAC-CS-101',
      designation: 'Professor & Head of Department',
      qualification: 'Ph.D. in Computer Science (Distributed Systems)',
      specialization: ['Distributed Systems', 'Cloud Computing', 'Microservices', 'Database Internals'],
      officeLocation: 'Academic Complex Block A, Room 402',
      officeHours: 'Mon, Wed, Fri 2:00 PM - 4:30 PM',
      subjectsTaught: ['CS601: Distributed Systems', 'CS602: Cloud Computing & DevOps'],
      publicationsCount: 24,
    });

    await FacultyProfile.create({
      user: facultyUser2._id,
      facultyId: 'FAC-AI-202',
      designation: 'Associate Professor & AI Lab Chair',
      qualification: 'Ph.D. in Machine Learning & Robotics',
      specialization: ['Deep Learning', 'Computer Vision', 'Generative AI', 'Reinforcement Learning'],
      officeLocation: 'Turing Center for Advanced Computing, Room 108',
      officeHours: 'Tue, Thu 1:30 PM - 3:30 PM',
      subjectsTaught: ['CS603: Deep Learning & AI'],
      publicationsCount: 31,
    });

    // 3. Create Clubs
    const club1 = await Club.create({
      name: 'ByteCraft Coding Club',
      category: 'Technical',
      description: 'The premier software engineering, open source, algorithmic programming, and hackathon guild of CampusNumberOne. We build real-world software, host code sprints, and win national hackathons.',
      logo: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&auto=format&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop&q=80',
      facultyCoordinator: {
        name: 'Prof. Sarah Jenkins',
        email: 'faculty@campus.edu',
        department: 'Computer Science',
      },
      studentLeader: {
        name: 'Alex Rivera',
        email: 'student@campus.edu',
        rollNumber: 'CS-2023-042',
      },
      memberCount: 245,
      meetingSchedule: 'Every Wednesday & Friday at 5:00 PM (Lab 4)',
      gallery: [
        { url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80', caption: 'ByteCraft 2026 Winter Code Sprint' },
        { url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80', caption: 'Hackathon Mentorship Workshop' },
        { url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=80', caption: 'Open Source Demo Day' },
      ],
      announcements: [
        { title: 'Weekly LeetCode Bootcamp Starting This Saturday', content: 'Join us for advanced dynamic programming and graph algorithms coaching sessions.' },
        { title: 'Open Call for HackCampus 2026 Organizing Committee', content: 'Volunteer roles are open for tech, design, sponsorships, and operations.' },
      ],
      socialLinks: {
        github: 'https://github.com/campus-bytecraft',
        discord: 'https://discord.gg/bytecraft-campus',
        instagram: 'https://instagram.com/bytecraft_campus',
      },
      createdBy: facultyUser._id,
    });

    const club2 = await Club.create({
      name: 'NeuralNet AI & Data Society',
      category: 'Technical',
      description: 'Pioneering artificial intelligence research, machine learning projects, NLP, LLMs, and computer vision competitions. Empowering students with cutting-edge hands-on AI experiments.',
      logo: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&auto=format&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
      facultyCoordinator: {
        name: 'Prof. Alan Turing',
        email: 'alan.turing@campus.edu',
        department: 'AI & Data Science',
      },
      studentLeader: {
        name: 'David Kim',
        email: 'david.kim@campus.edu',
        rollNumber: 'CS-2023-089',
      },
      memberCount: 180,
      meetingSchedule: 'Every Tuesday at 4:30 PM (Turing AI Lab)',
      gallery: [
        { url: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=800&auto=format&fit=crop&q=80', caption: 'Generative AI Masterclass' },
      ],
      announcements: [
        { title: 'Kaggle Grandmaster Workshop Announced', content: 'Special guest session on building winning multi-modal vision models.' },
      ],
      createdBy: facultyUser2._id,
    });

    const club3 = await Club.create({
      name: 'RoboTech & IoT Guild',
      category: 'Technical',
      description: 'Designing autonomous drones, rover systems, embedded microcontrollers (ESP32/Raspberry Pi), smart campus IoT devices, and competing in national Robocon challenges.',
      logo: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&auto=format&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&auto=format&fit=crop&q=80',
      facultyCoordinator: {
        name: 'Dr. Michael Chang',
        email: 'michael.chang@campus.edu',
        department: 'Electronics & Mechatronics',
      },
      studentLeader: {
        name: 'Priya Sharma',
        email: 'priya.sharma@campus.edu',
        rollNumber: 'EC-2023-033',
      },
      memberCount: 135,
      meetingSchedule: 'Thursdays at 5:00 PM (Robotics Arena)',
      createdBy: facultyUser._id,
    });

    const club4 = await Club.create({
      name: 'Aperture Photography & Media',
      category: 'Media & Photography',
      description: 'Capturing moments, creating cinematic short films, drone videography, campus journalism, and documenting all prime college memories through visual storytelling.',
      logo: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&auto=format&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1200&auto=format&fit=crop&q=80',
      facultyCoordinator: {
        name: 'Prof. Elena Rostova',
        email: 'elena.rostova@campus.edu',
        department: 'Design & Visual Arts',
      },
      studentLeader: {
        name: 'Emma Watson',
        email: 'emma.watson@campus.edu',
        rollNumber: 'IT-2023-018',
      },
      memberCount: 120,
      meetingSchedule: 'Saturdays at 11:00 AM (Media Studio)',
      createdBy: facultyUser._id,
    });

    const club5 = await Club.create({
      name: 'VentureLab Entrepreneurship Cell',
      category: 'Innovation & E-Cell',
      description: 'Igniting student startups, venture capital pitch competitions, incubator mentorship, angel investor networking, and turning campus projects into viable businesses.',
      logo: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&auto=format&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&auto=format&fit=crop&q=80',
      facultyCoordinator: {
        name: 'Dr. Richard Henderson',
        email: 'admin@campus.edu',
        department: 'Management Studies',
      },
      studentLeader: {
        name: 'Marcus Chen',
        email: 'marcus.chen@campus.edu',
        rollNumber: 'CS-2023-071',
      },
      memberCount: 155,
      meetingSchedule: 'Mondays at 4:30 PM (Incubation Center)',
      createdBy: adminUser._id,
    });

    const club6 = await Club.create({
      name: 'Vox Literary & Debating Society',
      category: 'Literature',
      description: 'Parliamentary debates, Model UN summits, creative writing journals, poetry slams, and fostering articulate oratory excellence.',
      logo: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&auto=format&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=1200&auto=format&fit=crop&q=80',
      facultyCoordinator: {
        name: 'Dr. Robert Blake',
        email: 'robert.blake@campus.edu',
        department: 'Humanities',
      },
      studentLeader: {
        name: 'Sofia Martinez',
        email: 'sofia.martinez@campus.edu',
        rollNumber: 'CS-2024-009',
      },
      memberCount: 95,
      meetingSchedule: 'Fridays at 4:00 PM (Auditorium Hall B)',
      createdBy: adminUser._id,
    });

    // Memberships for demo student
    await ClubMembership.create({
      club: club1._id,
      user: studentUser._id,
      role: 'Lead',
      status: 'Active',
    });

    await ClubMembership.create({
      club: club2._id,
      user: studentUser._id,
      role: 'Core Member',
      status: 'Active',
    });

    await ClubMembership.create({
      club: club5._id,
      user: studentUser._id,
      role: 'Member',
      status: 'Active',
    });

    // 4. Create Events
    const event1 = await Event.create({
      title: 'HackCampus 2026: 36-Hour National Hackathon',
      description: 'The flagship annual student hackathon of CampusNumberOne! Over \$15,000 in prizes, free food, swag, tech tracks in Web3, AI/GenAI, Cloud Native, HealthTech, and EdTech. Keynote by Silicon Valley engineering leaders.',
      date: '2026-10-18',
      time: '09:00 AM - Oct 19 09:00 PM',
      venue: 'Main Campus Convention Center & Innovation Lab',
      organizer: 'ByteCraft Coding Club & Tech Council',
      category: 'Hackathon',
      bannerImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop&q=80',
      registrationDeadline: '2026-10-15',
      maxParticipants: 300,
      registeredCount: 184,
      createdBy: facultyUser._id,
      status: 'Upcoming',
      tags: ['Hackathon', 'Coding', 'Prizes', 'AI', 'Innovation'],
    });

    const event2 = await Event.create({
      title: 'Global AI & Deep Learning Summit 2026',
      description: 'Explore state-of-the-art transformer architectures, LLM fine-tuning strategies, autonomous agents, and ethical AI in enterprise systems. Live coding demos and industry panel discussions.',
      date: '2026-10-25',
      time: '10:00 AM - 04:30 PM',
      venue: 'Turing Auditorium & Virtual Stream',
      organizer: 'NeuralNet AI & Data Society',
      category: 'Technical',
      bannerImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&auto=format&fit=crop&q=80',
      registrationDeadline: '2026-10-23',
      maxParticipants: 250,
      registeredCount: 142,
      createdBy: facultyUser2._id,
      status: 'Upcoming',
      tags: ['AI', 'MachineLearning', 'Robotics', 'Summit'],
    });

    const event3 = await Event.create({
      title: 'Euphoria 2026: Annual Campus Cultural Fest',
      description: 'Three electrifying days of live music concerts, battle of the bands, fashion showcase, street play competitions, food truck carnival, and DJ night extravaganza.',
      date: '2026-11-05',
      time: '04:00 PM - 11:00 PM Daily',
      venue: 'Grand Campus Amphitheatre',
      organizer: 'Student Affairs & Cultural Guild',
      category: 'Cultural',
      bannerImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&auto=format&fit=crop&q=80',
      registrationDeadline: '2026-11-03',
      maxParticipants: 1200,
      registeredCount: 650,
      createdBy: adminUser._id,
      status: 'Upcoming',
      tags: ['Music', 'Dance', 'Festival', 'Celebration'],
    });

    const event4 = await Event.create({
      title: 'Kubernetes & Cloud Native DevOps Hands-On Workshop',
      description: 'Deep dive into microservices deployment, Helm charts, CI/CD automation with GitHub Actions, Prometheus monitoring, and container security. Bring your laptops.',
      date: '2026-10-12',
      time: '01:30 PM - 05:30 PM',
      venue: 'Computer Science Lab 3',
      organizer: 'Prof. Sarah Jenkins',
      category: 'Workshop',
      bannerImage: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=1200&auto=format&fit=crop&q=80',
      registrationDeadline: '2026-10-11',
      maxParticipants: 60,
      registeredCount: 52,
      createdBy: facultyUser._id,
      status: 'Upcoming',
      tags: ['DevOps', 'Kubernetes', 'Cloud', 'Docker'],
    });

    const event5 = await Event.create({
      title: 'Campus Premier League: Inter-Department Sports Fest',
      description: 'Cricket, Football, Basketball, Badminton, and Table Tennis championships. Register your departmental teams or join cheer squads for glory.',
      date: '2026-10-30',
      time: '08:00 AM - 06:00 PM',
      venue: 'University Sports Complex',
      organizer: 'Campus Sports Directorate',
      category: 'Sports',
      bannerImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&auto=format&fit=crop&q=80',
      registrationDeadline: '2026-10-27',
      maxParticipants: 400,
      registeredCount: 220,
      createdBy: adminUser._id,
      status: 'Upcoming',
      tags: ['Sports', 'Cricket', 'Football', 'Championship'],
    });

    // Event Registrations for demo student
    await EventRegistration.create({
      event: event1._id,
      user: studentUser._id,
      ticketNumber: 'C1-HACK-8921-042',
      status: 'Confirmed',
    });

    await EventRegistration.create({
      event: event2._id,
      user: studentUser._id,
      ticketNumber: 'C1-SUMMIT-4301-118',
      status: 'Confirmed',
    });

    await EventRegistration.create({
      event: event4._id,
      user: studentUser._id,
      ticketNumber: 'C1-DEVOPS-9923-019',
      status: 'Confirmed',
    });

    // 5. Create Announcements
    await Announcement.create({
      title: '📢 Mid-Semester Examination Schedule - Autumn 2026',
      content: 'The official timetable for Mid-Semester Examinations for 2nd, 3rd, and 4th Year B.Tech students has been finalized. Exams commence on October 20, 2026. Hall tickets and seating plans can be downloaded from the academics portal. Please ensure all internal dues are cleared.',
      category: 'Examination',
      priority: 'Urgent',
      isPinned: true,
      targetAudience: 'All',
      department: 'Examination Cell & Dean Academics',
      author: adminUser._id,
    });

    await Announcement.create({
      title: '💼 Campus Placement Drive: Google & Microsoft Hiring 2027 Batch',
      content: 'Career Development Centre (CDC) announces open applications for Software Engineering and Cloud Operations roles at Google and Microsoft. Eligibility criteria: CGPA 8.0 and above with no active backlogs. Round 1 online assessments will occur on October 16, 2026. Submit updated resumes in CDC portal.',
      category: 'Placement',
      priority: 'High',
      isPinned: true,
      targetAudience: 'Final Year',
      department: 'Training & Placement Cell',
      author: adminUser._id,
    });

    await Announcement.create({
      title: '🔬 Call for Papers & Research Demonstrations - Tech Expo 2026',
      content: 'Faculty and students are invited to submit original research papers and functional prototypes for the upcoming IEEE International Symposium on Next-Gen Systems. Selected papers will be published in IEEE Xplore with funding grants up to \$2,000 per project.',
      category: 'Academic',
      priority: 'Normal',
      isPinned: false,
      targetAudience: 'All',
      department: 'Department of Computer Science',
      author: facultyUser._id,
    });

    await Announcement.create({
      title: '📚 Central Campus Library: 24/7 Reading Rooms Open for Exams',
      content: 'In preparation for mid-term exams, the Central Digital Library and 4th Floor Silent Study pods will remain open 24 hours daily from October 10 through November 15. Free Wi-Fi, high-speed charging outlets, and midnight coffee service available.',
      category: 'General',
      priority: 'Normal',
      isPinned: false,
      targetAudience: 'Students',
      department: 'Library Services',
      author: adminUser._id,
    });

    await Announcement.create({
      title: '🌧️ Weather Advisory & Hybrid Mode Class Notice',
      content: 'Due to forecasted heavy rainfall on Monday, all laboratory sessions and lectures will run in hybrid format. Students commuting from distant suburbs can join via live lecture links posted in the Academics tab.',
      category: 'Emergency',
      priority: 'High',
      isPinned: false,
      targetAudience: 'All',
      department: 'Dean Student Welfare',
      author: adminUser._id,
    });

    // 6. Create Community Posts
    const post1 = await Post.create({
      author: studentUser._id,
      content: '🚀 Super excited to announce that our team "ByteForce" won 1st Place at the National Smart India Hackathon 2026! We built an AI-powered autonomous emergency response and hospital routing system. Big shoutout to Prof. Sarah Jenkins for her invaluable mentorship throughout the 36-hour sprint! 🎉💻',
      images: [
        'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
      ],
      category: 'Achievement',
      tags: ['hackathon', 'ai', 'firstplace', 'campuspride', 'opensource'],
      likes: [facultyUser._id, studentUser2._id, studentUser3._id, studentUser4._id, adminUser._id],
      likeCount: 5,
      commentCount: 3,
      isPinned: true,
    });

    const post2 = await Post.create({
      author: facultyUser._id,
      content: 'Heartiest congratulations to Alex Rivera and the ByteCraft team! Fantastic engineering discipline and innovative problem solving. Proud moment for our Computer Science Department! 🌟 Keep building impactful solutions.',
      category: 'Campus Life',
      tags: ['congratulations', 'csdept', 'excellence'],
      likes: [studentUser._id, studentUser2._id, adminUser._id],
      likeCount: 3,
      commentCount: 1,
    });

    const post3 = await Post.create({
      author: studentUser2._id,
      content: '🎨 The new UI/UX designs for our Campus Photography Exhibition catalog are ready! What do you guys think of the dark glassmorphism theme? Feedback welcome in the comments! 📸✨',
      images: [
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      ],
      category: 'Project',
      tags: ['design', 'figma', 'uiux', 'creativity'],
      likes: [studentUser._id, studentUser3._id, studentUser4._id],
      likeCount: 3,
      commentCount: 2,
    });

    const post4 = await Post.create({
      author: studentUser3._id,
      content: 'Anyone preparing for the upcoming Microsoft Cloud SWE technical interview? Looking for 2-3 folks to form a weekly mock-interview study group covering System Design and Distributed Caching. Drop a comment below if interested! 🤝',
      category: 'Question',
      tags: ['placement', 'systemdesign', 'interviewprep', 'studygroup'],
      likes: [studentUser._id, studentUser4._id],
      likeCount: 2,
      commentCount: 2,
    });

    // Comments for Post 1
    await Comment.create({
      post: post1._id,
      author: studentUser2._id,
      content: 'Massive congratulations Alex! You guys truly deserved this win! The live demo was incredible! 🔥🏆',
    });

    await Comment.create({
      post: post1._id,
      author: studentUser3._id,
      content: 'Incredible work team! Inspiring benchmark for all of us preparing for HackCampus next month! 👏',
    });

    await Comment.create({
      post: post1._id,
      author: adminUser._id,
      content: 'Outstanding achievement representing CampusNumberOne on the national stage. Well done!',
    });

    // 7. Create Study Materials
    await StudyMaterial.create({
      title: 'CS601 - Distributed Systems Complete Lecture Slides & Architecture Diagrams',
      description: 'Comprehensive 12-week course notes covering consensus algorithms (Paxos & Raft), vector clocks, distributed shared memory, RPC frameworks, CAP theorem, and Byzantine Fault Tolerance.',
      subject: 'Distributed Systems',
      subjectCode: 'CS601',
      department: 'Computer Science & Engineering',
      semester: 6,
      materialType: 'Lecture Notes',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      fileName: 'CS601_Distributed_Systems_Lectures_Complete.pdf',
      fileSize: '4.8 MB',
      uploadedBy: facultyUser._id,
      downloadsCount: 142,
      tags: ['DistributedSystems', 'Raft', 'Consensus', 'Architecture'],
    });

    await StudyMaterial.create({
      title: 'CS602 - Cloud Native DevOps & Kubernetes Lab Manual 2026',
      description: 'Step-by-step laboratory instructions for building multi-tier containerized architectures on AWS EKS, configuring ingress controllers, CI/CD with ArgoCD, and Prometheus telemetry.',
      subject: 'Cloud Computing & DevOps',
      subjectCode: 'CS602',
      department: 'Computer Science & Engineering',
      semester: 6,
      materialType: 'Lab Manual',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      fileName: 'CS602_Cloud_Kubernetes_LabManual.pdf',
      fileSize: '3.6 MB',
      uploadedBy: facultyUser._id,
      downloadsCount: 128,
      tags: ['Kubernetes', 'DevOps', 'Docker', 'Cloud'],
    });

    await StudyMaterial.create({
      title: 'CS603 - Deep Learning & Neural Network Architectures Handbook',
      description: 'Mathematical foundations and PyTorch implementations for CNNs, Transformers, Self-Attention mechanisms, Diffusion models, and LLM fine-tuning techniques (LoRA/QLoRA).',
      subject: 'Deep Learning & AI',
      subjectCode: 'CS603',
      department: 'Artificial Intelligence & Robotics',
      semester: 6,
      materialType: 'Reference Book',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      fileName: 'CS603_DeepLearning_PyTorch_Handbook.pdf',
      fileSize: '6.2 MB',
      uploadedBy: facultyUser2._id,
      downloadsCount: 185,
      tags: ['DeepLearning', 'PyTorch', 'Transformers', 'GenAI'],
    });

    await StudyMaterial.create({
      title: 'CS604 - Clean Code & Advanced Microservices Design Patterns',
      description: 'Standard software design patterns (Saga pattern, Event Sourcing, CQRS, Circuit Breaker) illustrated with production-grade TypeScript and Go code examples.',
      subject: 'Advanced Software Engineering',
      subjectCode: 'CS604',
      department: 'Computer Science & Engineering',
      semester: 6,
      materialType: 'Presentation',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      fileName: 'CS604_Microservices_Design_Patterns.pdf',
      fileSize: '2.9 MB',
      uploadedBy: facultyUser._id,
      downloadsCount: 95,
      tags: ['SoftwareEngineering', 'DesignPatterns', 'CleanCode'],
    });

    // 8. Create Assignments
    const assignment1 = await Assignment.create({
      title: 'Assignment 1: Distributed Raft Consensus Protocol Implementation',
      description: 'Implement leader election, log replication, and heartbeat verification in a simulated 5-node cluster using Node.js or Python. Include test suites demonstrating split-vote resolution and network partition healing.',
      subject: 'Distributed Systems',
      subjectCode: 'CS601',
      department: 'Computer Science & Engineering',
      semester: 6,
      dueDate: '2026-10-22T23:59:59Z',
      maxMarks: 100,
      attachmentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      attachmentName: 'CS601_Assignment1_Raft_Guidelines.pdf',
      createdBy: facultyUser._id,
      status: 'Active',
    });

    const assignment2 = await Assignment.create({
      title: 'Assignment 2: Cloud Native Microservices CI/CD Pipeline on Kubernetes',
      description: 'Architect a 3-service containerized application, write Helm charts, configure GitHub Actions workflow for automated testing and container image scanning, and deploy on a Minikube/Kind cluster.',
      subject: 'Cloud Computing & DevOps',
      subjectCode: 'CS602',
      department: 'Computer Science & Engineering',
      semester: 6,
      dueDate: '2026-10-28T23:59:59Z',
      maxMarks: 100,
      attachmentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      attachmentName: 'CS602_Assignment2_Kubernetes_Specs.pdf',
      createdBy: facultyUser._id,
      status: 'Active',
    });

    const assignment3 = await Assignment.create({
      title: 'Assignment 3: Multi-Head Attention & Transformer Implementation from Scratch',
      description: 'Write custom PyTorch modules for scaled dot-product attention, positional encoding, and encoder-decoder blocks without using nn.Transformer high-level helpers. Train on a toy translation dataset.',
      subject: 'Deep Learning & AI',
      subjectCode: 'CS603',
      department: 'Artificial Intelligence & Robotics',
      semester: 6,
      dueDate: '2026-11-04T23:59:59Z',
      maxMarks: 100,
      createdBy: facultyUser2._id,
      status: 'Active',
    });

    // Submissions
    await AssignmentSubmission.create({
      assignment: assignment1._id,
      student: studentUser._id,
      submissionText: 'GitHub Repo: https://github.com/alexrivera-tech/raft-distributed-consensus - All unit and integration test suites passing with 100% coverage.',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      fileName: 'AlexRivera_CS601_Raft_Report.pdf',
      status: 'Graded',
      marksObtained: 98,
      feedback: 'Exceptional implementation! Your log replication edge-case handling during node drops was thoroughly documented and robust.',
      gradedBy: facultyUser._id,
      gradedAt: new Date(),
    });

    // 9. Create Achievements
    await Achievement.create({
      user: studentUser._id,
      title: '1st Place National Winner - Smart India Hackathon 2026',
      description: 'Developed an autonomous emergency routing and multi-hospital resource allocation AI system across 36 non-stop hours among 1,200 participating collegiate teams.',
      category: 'Hackathon',
      date: '2026-08-20',
      issuer: 'Ministry of Education & Innovation Cell',
      certificateUrl: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800&auto=format&fit=crop&q=80',
      proofLink: 'https://sih.gov.in/winner-announcements/2026',
      featured: true,
      likes: [facultyUser._id, studentUser2._id, studentUser3._id],
    });

    await Achievement.create({
      user: studentUser._id,
      title: 'AWS Certified Solutions Architect – Associate (SAA-C03)',
      description: 'Demonstrated deep expertise in resilient high-availability cloud architecture, serverless microservices, IAM security, and cost-effective VPC networking.',
      category: 'Certification',
      date: '2026-06-15',
      issuer: 'Amazon Web Services',
      certificateUrl: 'https://images.unsplash.com/photo-1579389083078-4e7018379f7e?w=800&auto=format&fit=crop&q=80',
      proofLink: 'https://aws.amazon.com/verification/credly/alex-rivera',
      featured: true,
      likes: [studentUser2._id, studentUser4._id],
    });

    await Achievement.create({
      user: studentUser._id,
      title: 'Research Paper Published: Distributed Consensus for Edge Computing',
      description: 'First author on IEEE conference publication analyzing lightweight fault-tolerant quorum protocols in bandwidth-constrained IoT sensor mesh environments.',
      category: 'Academic',
      date: '2026-05-10',
      issuer: 'IEEE International Conference on Distributed Systems',
      certificateUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80',
      proofLink: 'https://ieeexplore.ieee.org/document/9928174',
      featured: true,
      likes: [facultyUser._id, facultyUser2._id, adminUser._id],
    });

    await Achievement.create({
      user: studentUser._id,
      title: 'Software Engineering Intern @ CloudScale Technologies',
      description: 'Engineered high-throughput GraphQL APIs, optimized Redis caching pipelines resulting in a 42% latency reduction, and built reusable React design components.',
      category: 'Internship',
      date: '2026-07-30',
      issuer: 'CloudScale Technologies Inc.',
      certificateUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
      featured: false,
      likes: [studentUser3._id],
    });

    // 10. Create Notifications
    await Notification.create({
      recipient: studentUser._id,
      sender: facultyUser._id,
      title: 'Assignment Graded! 🎯',
      message: 'Your submission for "Distributed Raft Consensus Protocol Implementation" received 98/100 marks.',
      type: 'assignment_graded',
      link: '/academics',
      isRead: false,
    });

    await Notification.create({
      recipient: studentUser._id,
      sender: facultyUser._id,
      title: 'Event Registration Confirmed! 🎟️',
      message: 'You have successfully registered for "HackCampus 2026: 36-Hour National Hackathon". Ticket: C1-HACK-8921-042',
      type: 'event_registration',
      link: `/events/${event1._id}`,
      isRead: false,
    });

    await Notification.create({
      recipient: studentUser._id,
      sender: adminUser._id,
      title: 'New Campus Announcement 📢',
      message: 'Mid-Semester Examination Schedule - Autumn 2026 has been published.',
      type: 'announcement',
      link: '/announcements',
      isRead: true,
    });

    await Notification.create({
      recipient: studentUser._id,
      sender: studentUser2._id,
      title: 'New comment on your post 💬',
      message: 'Emma Watson commented: "Massive congratulations Alex! You guys truly deserved this win!"',
      type: 'post_comment',
      link: '/community',
      isRead: true,
    });

    console.log('✅ Seed completed successfully! All demo users, events, clubs, academics, posts, and achievements created.');
  } catch (error) {
    console.error('❌ Database seeding error:', error);
  }
};
