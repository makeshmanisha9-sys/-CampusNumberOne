import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import clubService from '../../services/clubService';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import {
  Users,
  Calendar,
  Building,
  GraduationCap,
  ArrowLeft,
  UserPlus,
  UserCheck,
  Megaphone,
  Image,
  Globe,
} from 'lucide-react';

export const ClubDetailPage = () => {
  const { id } = useParams();
  const { user, role, isAuthenticated } = useAuth();
  const { success, error } = useToast();

  const [club, setClub] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchClub = async () => {
    setLoading(true);
    try {
      const res = await clubService.getClubById(id);
      if (res.success) {
        setClub(res.club);
        setIsMember(res.isMember);
        setMembers(res.members || []);
      }
    } catch (err) {
      error('Failed to load club information');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClub();
  }, [id]);

  const handleJoin = async () => {
    if (!isAuthenticated) {
      error('Please log in to join clubs');
      return;
    }
    setActionLoading(true);
    try {
      const res = await clubService.joinClub(id);
      if (res.success) {
        success(`You are now a member of ${club.name}!`);
        fetchClub();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to join club');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeave = async () => {
    if (!window.confirm(`Leave ${club.name}?`)) return;
    setActionLoading(true);
    try {
      const res = await clubService.leaveClub(id);
      if (res.success) {
        success(`You have left ${club.name}`);
        fetchClub();
      }
    } catch (err) {
      error('Failed to leave club');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Loader fullPage message="Loading club portal..." />;
  if (!club) return <div className="text-center py-12">Club not found</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <Link
        to="/clubs"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Clubs</span>
      </Link>

      {/* Cover Header */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-slate-900 border border-slate-800">
        <img
          src={club.coverImage || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop&q=80'}
          alt={club.name}
          className="w-full h-56 sm:h-72 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

        <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={club.logo || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&auto=format&fit=crop&q=80'}
              alt={club.name}
              className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-lg bg-white shrink-0"
            />
            <div className="text-white">
              <Badge variant="cyan" className="mb-1">{club.category}</Badge>
              <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight">{club.name}</h1>
              <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                <span>{club.memberCount || 0} Registered Campus Members</span>
              </p>
            </div>
          </div>

          <div>
            {role === 'student' && (
              isMember ? (
                <button
                  onClick={handleLeave}
                  disabled={actionLoading}
                  className="px-5 py-2.5 rounded-2xl bg-slate-800/90 hover:bg-rose-950 text-rose-300 font-bold text-xs border border-slate-700 transition-colors"
                >
                  {actionLoading ? 'Updating...' : 'Joined (Leave Club)'}
                </button>
              ) : (
                <button
                  onClick={handleJoin}
                  disabled={actionLoading}
                  className="px-6 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs shadow-glow flex items-center gap-1.5 transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{actionLoading ? 'Joining...' : 'Join Club'}</span>
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Grid: Overview, Gallery, Announcements, Members */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2-Cols */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-card space-y-4">
            <h2 className="text-base font-bold text-slate-900">About Our Society</h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {club.description}
            </p>
          </div>

          {/* Club Photo Gallery */}
          {club.gallery && club.gallery.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-card space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Image className="w-4 h-4 text-blue-600" />
                <span>Club Photo Gallery</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {club.gallery.map((img, idx) => (
                  <div key={idx} className="rounded-2xl overflow-hidden bg-slate-900 h-36 group relative">
                    <img
                      src={img.url}
                      alt={img.caption || 'Gallery image'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    {img.caption && (
                      <div className="absolute inset-x-0 bottom-0 bg-slate-950/80 p-2 text-[10px] text-white truncate">
                        {img.caption}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Members List */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Enrolled Members ({members.length})</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
              {members.map((m) => (
                <div key={m._id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                  <img
                    src={m.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.user?.name || 'User'}`}
                    alt={m.user?.name}
                    className="w-8 h-8 rounded-xl object-cover bg-slate-200"
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-xs text-slate-900 truncate">{m.user?.name}</p>
                    <span className="text-[10px] font-semibold text-blue-600">{m.role || 'Member'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1-Col */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-card space-y-5 text-xs">
            <h3 className="text-sm font-bold text-slate-900">Club Leadership</h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <GraduationCap className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-800">Student Leader</p>
                  <p className="text-slate-600 font-semibold">{club.studentLeader?.name || 'Alex Rivera'}</p>
                  <p className="text-[11px] text-slate-400">{club.studentLeader?.email || 'alex.rivera@campus.edu'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Building className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-800">Faculty Coordinator</p>
                  <p className="text-slate-600 font-semibold">{club.facultyCoordinator?.name || 'Prof. Sarah'}</p>
                  <p className="text-[11px] text-slate-400">{club.facultyCoordinator?.department || 'CS Dept'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-800">Meeting Schedule</p>
                  <p className="text-slate-600">{club.meetingSchedule}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubDetailPage;
