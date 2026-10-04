import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  GraduationCap,
  Calendar,
  Users,
  Megaphone,
  MessageSquare,
  BookOpen,
  Trophy,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  CheckCircle2,
  TrendingUp,
  Activity,
  Layers,
  Compass,
} from 'lucide-react';

export const LandingPage = () => {
  const { isAuthenticated, role, quickDemoLogin } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();

  const handleQuickLogin = async (roleType) => {
    const res = await quickDemoLogin(roleType);
    if (res.success) {
      success(`Logged in as ${roleType.toUpperCase()}: ${res.user.name}`);
      if (roleType === 'admin') navigate('/admin');
      else if (roleType === 'faculty') navigate('/faculty');
      else navigate('/dashboard');
    }
  };

  const features = [
    {
      title: 'Events & Hackathons',
      description: 'Discover workshops, inter-college fests, sports leagues, and national 36-hour hackathons with 1-click registration and ticket badges.',
      icon: Calendar,
      color: 'from-blue-500 to-indigo-600',
      badgeColor: 'primary',
      link: '/events',
    },
    {
      title: 'Clubs & Societies',
      description: 'Join coding guilds, AI/ML research groups, robotics workshops, photography clubs, and entrepreneurship incubation cells.',
      icon: Users,
      color: 'from-cyan-500 to-blue-600',
      badgeColor: 'cyan',
      link: '/clubs',
    },
    {
      title: 'Campus Community',
      description: 'A dedicated social stream for student projects, team formation, hackathon victories, question discussions, and campus updates.',
      icon: MessageSquare,
      color: 'from-emerald-500 to-teal-600',
      badgeColor: 'success',
      link: '/community',
    },
    {
      title: 'Academics & Notes',
      description: 'Centralized repository of lecture PDFs, syllabus notes, lab manuals, and online assignment submission portals with faculty grading.',
      icon: BookOpen,
      color: 'from-amber-500 to-orange-600',
      badgeColor: 'warning',
      link: '/academics',
    },
    {
      title: 'Student Achievements',
      description: 'Showcase national hackathon victories, AWS certifications, internships, research publications, and sports medals in your public portfolio.',
      icon: Trophy,
      color: 'from-purple-500 to-pink-600',
      badgeColor: 'purple',
      link: '/achievements',
    },
    {
      title: 'Official Announcements',
      description: 'Instant prioritized broadcasts for exams, placement drives, urgent alerts, and administrative circulars with real-time push alerts.',
      icon: Megaphone,
      color: 'from-rose-500 to-red-600',
      badgeColor: 'danger',
      link: '/announcements',
    },
  ];

  return (
    <div className="bg-slate-900 text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-16 pb-24 lg:pt-24 lg:pb-32 px-4 sm:px-6 lg:px-8">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-600/30 to-cyan-500/20 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          {/* Top Tag Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/90 border border-slate-700 text-xs font-semibold text-cyan-400 mb-8 shadow-card">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Campus Digital Transformation 2026</span>
          </div>

          {/* Main Hero Header */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight sm:leading-tight">
            <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              CampusNumberOne
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              One Campus. One Platform. Everything Connected.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            The next-generation digital campus operating system unifying students, faculty, clubs, events, announcements, academics, and achievements in one blazing-fast web platform.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {isAuthenticated ? (
              <Link
                to={role === 'admin' ? '/admin' : role === 'faculty' ? '/faculty' : '/dashboard'}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-cyan-400 hover:from-blue-500 hover:to-cyan-300 text-slate-950 font-extrabold text-sm shadow-glow flex items-center gap-2 transition-all transform hover:-translate-y-1"
              >
                <span>Enter Your Dashboard ({role?.toUpperCase()})</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold text-sm shadow-glow flex items-center gap-2 transition-all transform hover:-translate-y-1"
                >
                  <span>Get Started Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/events"
                  className="px-8 py-4 rounded-2xl bg-slate-800/90 hover:bg-slate-700/90 text-white font-bold text-sm border border-slate-700 transition-all transform hover:-translate-y-1"
                >
                  Explore Campus
                </Link>
              </>
            )}
          </div>

          {/* Quick Demo Exploration Buttons */}
          <div className="mt-8 pt-8 border-t border-slate-800/80 max-w-xl mx-auto">
            <p className="text-xs text-slate-400 font-semibold mb-3">1-Click Live Role Test Drives:</p>
            <div className="flex flex-wrap justify-center gap-2.5">
              <button
                onClick={() => handleQuickLogin('student')}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Student: Alex Rivera</span>
              </button>
              <button
                onClick={() => handleQuickLogin('faculty')}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Faculty: Prof. Sarah</span>
              </button>
              <button
                onClick={() => handleQuickLogin('admin')}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin: Dr. Richard</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Metrics Counter Bar */}
        <div className="max-w-5xl mx-auto mt-16 px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-3xl bg-slate-800/70 border border-slate-700/80 backdrop-blur-xl shadow-2xl">
            <div className="text-center p-3">
              <p className="text-3xl font-extrabold text-cyan-400">4,500+</p>
              <p className="text-xs font-medium text-slate-400 mt-1">Active Students</p>
            </div>
            <div className="text-center p-3 border-l border-slate-700/60">
              <p className="text-3xl font-extrabold text-blue-400">120+</p>
              <p className="text-xs font-medium text-slate-400 mt-1">Annual Events</p>
            </div>
            <div className="text-center p-3 border-l-0 md:border-l border-slate-700/60">
              <p className="text-3xl font-extrabold text-emerald-400">18+</p>
              <p className="text-xs font-medium text-slate-400 mt-1">Active Clubs</p>
            </div>
            <div className="text-center p-3 border-l border-slate-700/60">
              <p className="text-3xl font-extrabold text-purple-400">99.8%</p>
              <p className="text-xs font-medium text-slate-400 mt-1">Connected Uptime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Features Grid Section */}
      <section className="py-24 bg-slate-950 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-2">
              Unified Ecosystem
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Everything your campus needs in one integrated hub
            </p>
            <p className="mt-4 text-sm text-slate-400">
              Break down silos between academic departments, student clubs, administration, and campus life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="group relative p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all duration-300 hover:shadow-card hover:-translate-y-1.5 flex flex-col justify-between"
                >
                  <div>
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${feat.color} flex items-center justify-center text-white mb-6 shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white tracking-tight">{feat.title}</h3>
                    <p className="mt-3 text-xs text-slate-400 leading-relaxed">{feat.description}</p>
                  </div>
                  <div className="mt-6 pt-6 border-t border-slate-800/80">
                    <Link
                      to={feat.link}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      <span>Explore {feat.title.split(' ')[0]}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Visual Preview Section */}
      <section className="py-24 bg-slate-900 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs font-semibold text-blue-400 mb-4">
              <Zap className="w-3.5 h-3.5" /> High Performance MERN Stack
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
              Modern SaaS Dashboard Experience For The Modern Campus
            </h2>
            <p className="mt-4 text-sm text-slate-300 leading-relaxed">
              Designed with deep navy aesthetics, clean card layouts, instant Socket.IO real-time notifications, and dedicated role-specific controls for Students, Faculty members, and Campus Administrators.
            </p>

            <ul className="mt-6 space-y-3">
              {[
                'Real-time Socket.IO notifications for urgent exams & assignments',
                'One-click event ticketing with QR/Ticket ID verification',
                'Collaborative campus community social feed with likes & moderation',
                'Comprehensive academic repository with notes and grading workflows',
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs font-medium text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex gap-4">
              <Link
                to="/register"
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-blue-glow transition-all"
              >
                Join CampusNumberOne
              </Link>
              <Link
                to="/about"
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Visual Showcase Card */}
          <div className="relative">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-600 opacity-30 blur-2xl"></div>
            <div className="relative rounded-3xl bg-slate-950 p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
              {/* Mock Dashboard Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-xs font-mono text-slate-400 ml-2">campusnumberone.internal/portal</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Live System OK
                </span>
              </div>

              {/* Mock Mini Widgets */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <p className="text-[11px] text-slate-400">Upcoming Hackathon</p>
                  <p className="text-sm font-bold text-white mt-1">HackCampus 2026</p>
                  <span className="inline-block mt-2 px-2 py-0.5 rounded-md text-[9px] font-bold bg-blue-500/20 text-cyan-300">
                    Confirmed Ticket
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <p className="text-[11px] text-slate-400">Academic Standing</p>
                  <p className="text-sm font-bold text-emerald-400 mt-1">9.15 CGPA • 91% Attd</p>
                  <span className="inline-block mt-2 px-2 py-0.5 rounded-md text-[9px] font-bold bg-emerald-500/20 text-emerald-300">
                    Dean's Honors
                  </span>
                </div>
              </div>

              {/* Mock Announcement Item */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                  <Megaphone className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-white">Placement Drive: Google & Microsoft</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Application deadline Oct 16, 2026 for 2027 SWE roles.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-950 px-4 text-center border-t border-slate-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Ready to experience the connected campus?
          </h2>
          <p className="mt-4 text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Join thousands of students and faculty members already revolutionizing their college experience on CampusNumberOne.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-cyan-400 text-slate-950 font-extrabold text-sm shadow-glow transition-all transform hover:-translate-y-1"
            >
              Create Free Account
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition-all"
            >
              Sign In To Portal
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
