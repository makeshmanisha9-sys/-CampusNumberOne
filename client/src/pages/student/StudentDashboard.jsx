import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import eventService from '../../services/eventService';
import clubService from '../../services/clubService';
import announcementService from '../../services/announcementService';
import achievementService from '../../services/achievementService';
import academicService from '../../services/academicService';
import EventCard from '../../components/events/EventCard';
import ClubCard from '../../components/clubs/ClubCard';
import AnnouncementCard from '../../components/announcements/AnnouncementCard';
import AchievementCard from '../../components/achievements/AchievementCard';
import AttendanceWidget from '../../components/academics/AttendanceWidget';
import AchievementModal from '../../components/achievements/AchievementModal';
import Loader from '../../components/common/Loader';
import {
  Calendar,
  Users,
  Megaphone,
  Trophy,
  BookOpen,
  ArrowRight,
  PlusCircle,
  Sparkles,
  Ticket,
  GraduationCap,
  MessageSquare,
} from 'lucide-react';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [myClubs, setMyClubs] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [academicOverview, setAcademicOverview] = useState(null);
  const [showAchievementModal, setShowAchievementModal] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [eventsRes, clubsRes, notifsRes, achRes, acadRes] = await Promise.all([
        eventService.getMyRegistrations(),
        clubService.getMyClubs(),
        announcementService.getAnnouncements({ limit: 3, isPinned: true }),
        achievementService.getMyAchievements(),
        academicService.getStudentOverview(),
      ]);

      if (eventsRes.success) setRegisteredEvents(eventsRes.registrations || []);
      if (clubsRes.success) setMyClubs(clubsRes.clubs || []);
      if (notifsRes.success) setAnnouncements(notifsRes.announcements || []);
      if (achRes.success) setAchievements(achRes.achievements || []);
      if (acadRes.success) setAcademicOverview(acadRes);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <Loader fullPage message="Loading your personalized campus dashboard..." />;
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-campus-navy-800 to-blue-950 p-6 sm:p-8 text-white overflow-hidden shadow-2xl border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-[11px] font-bold text-cyan-300">
              <Sparkles className="w-3 h-3" /> Student Portal 2026
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name || 'Alex'}! 👋
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              You are enrolled in {user?.department || 'Computer Science & Engineering'}. Check your upcoming hackathon schedules, club meetups, and academic assignments below.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3 bg-slate-800/80 p-3 rounded-2xl border border-slate-700/80 backdrop-blur-md">
            <div className="text-center px-3">
              <p className="text-xl font-extrabold text-cyan-400">{registeredEvents.length}</p>
              <p className="text-[10px] text-slate-400 font-semibold">Events Registered</p>
            </div>
            <div className="w-px h-8 bg-slate-700"></div>
            <div className="text-center px-3">
              <p className="text-xl font-extrabold text-blue-400">{myClubs.length}</p>
              <p className="text-[10px] text-slate-400 font-semibold">Clubs Joined</p>
            </div>
            <div className="w-px h-8 bg-slate-700"></div>
            <div className="text-center px-3">
              <p className="text-xl font-extrabold text-emerald-400">{achievements.length}</p>
              <p className="text-[10px] text-slate-400 font-semibold">Achievements</p>
            </div>
          </div>
        </div>

        {/* Quick Action Button Strip */}
        <div className="mt-6 pt-6 border-t border-slate-800 flex flex-wrap items-center gap-3">
          <Link
            to="/events"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-blue-glow flex items-center gap-1.5 transition-all"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Explore Events</span>
          </Link>
          <Link
            to="/clubs"
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-glow flex items-center gap-1.5 transition-all"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Join a Club</span>
          </Link>
          <Link
            to="/community"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 flex items-center gap-1.5 transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Create Post</span>
          </Link>
          <button
            onClick={() => setShowAchievementModal(true)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 font-bold text-xs border border-slate-700 flex items-center gap-1.5 transition-all"
          >
            <Trophy className="w-3.5 h-3.5 text-purple-400" />
            <span>Add Achievement</span>
          </button>
        </div>
      </div>

      {/* Academic Attendance & CGPA Overview */}
      <AttendanceWidget
        attendance={academicOverview?.attendance}
        marks={academicOverview?.marks}
        cgpa={academicOverview?.cgpa}
      />

      {/* 2-Column Section: Registered Events & Pinned Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Registered Events */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ticket className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">My Registered Events</h3>
            </div>
            <Link to="/events" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
              <span>All Events</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {registeredEvents.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-dashed border-slate-300 text-center space-y-3">
              <Calendar className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs font-bold text-slate-700">No active event registrations yet</p>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                Explore upcoming hackathons, tech fests, and workshops to secure your ticket.
              </p>
              <Link
                to="/events"
                className="inline-block px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-sm"
              >
                Browse Events
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {registeredEvents.map((reg) => (
                <div
                  key={reg._id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex flex-col items-center justify-center shrink-0 font-bold text-xs">
                      <span>{reg.event?.date?.split('-')[1] || 'OCT'}</span>
                      <span className="text-base text-blue-700 font-extrabold">{reg.event?.date?.split('-')[2] || '18'}</span>
                    </div>
                    <div className="min-w-0">
                      <Link to={`/events/${reg.event?._id}`} className="font-bold text-xs text-slate-900 hover:text-blue-600 truncate block">
                        {reg.event?.title || 'Campus Event'}
                      </Link>
                      <p className="text-[11px] text-slate-400 mt-0.5 truncate">{reg.event?.venue}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-700">
                        Ticket: {reg.ticketNumber}
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/events/${reg.event?._id}`}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pinned Announcements */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-cyan-600" />
              <h3 className="text-base font-bold text-slate-900">Priority Announcements</h3>
            </div>
            <Link to="/announcements" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {announcements.map((ann) => (
              <AnnouncementCard key={ann._id} announcement={ann} onUpdate={fetchDashboardData} />
            ))}
          </div>
        </div>
      </div>

      {/* Clubs & Achievements Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Joined Clubs */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              <h3 className="text-base font-bold text-slate-900">Clubs You've Joined</h3>
            </div>
            <Link to="/clubs" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
              <span>Explore More Clubs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {myClubs.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-dashed border-slate-300 text-center space-y-3">
              <Users className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs font-bold text-slate-700">You haven't joined any clubs yet</p>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                Join Coding, AI/ML, Robotics, Photography or E-Cell clubs to expand your campus network.
              </p>
              <Link
                to="/clubs"
                className="inline-block px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-glow"
              >
                Discover Clubs
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {myClubs.map((club) => (
                <div key={club._id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
                  <div className="flex items-center gap-3">
                    <img src={club.logo} alt={club.name} className="w-10 h-10 rounded-xl object-cover" />
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-slate-900 truncate">{club.name}</h4>
                      <p className="text-[10px] text-slate-400">{club.category}</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{club.description}</p>
                  <Link
                    to={`/clubs/${club._id}`}
                    className="block text-center py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition-colors"
                  >
                    Enter Club Portal
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Achievements */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-bold text-slate-900">Your Portfolio Showcase</h3>
            </div>
            <button
              onClick={() => setShowAchievementModal(true)}
              className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Entry</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {achievements.slice(0, 2).map((ach) => (
              <AchievementCard key={ach._id} achievement={ach} onUpdate={fetchDashboardData} />
            ))}
          </div>
        </div>
      </div>

      {showAchievementModal && (
        <AchievementModal
          isOpen={showAchievementModal}
          onClose={() => setShowAchievementModal(false)}
          onSaved={fetchDashboardData}
        />
      )}
    </div>
  );
};

export default StudentDashboard;
