import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import clubService from '../../services/clubService';
import Badge from '../common/Badge';
import {
  Users,
  Calendar,
  Sparkles,
  ArrowRight,
  UserPlus,
  UserCheck,
  Building,
  GraduationCap,
  Megaphone,
} from 'lucide-react';

export const ClubCard = ({ club, onUpdate }) => {
  const { user, role, isAuthenticated } = useAuth();
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);

  const isMember = club.isMember;

  const handleJoin = async () => {
    if (!isAuthenticated) {
      error('Please log in to join campus clubs');
      return;
    }
    setLoading(true);
    try {
      const res = await clubService.joinClub(club._id);
      if (res.success) {
        success(`Welcome to ${club.name}!`);
        if (onUpdate) onUpdate();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to join club');
    } finally {
      setLoading(false);
    }
  };

  const handleLeave = async () => {
    if (!window.confirm(`Are you sure you want to leave ${club.name}?`)) return;
    setLoading(true);
    try {
      const res = await clubService.leaveClub(club._id);
      if (res.success) {
        success(`You have left ${club.name}`);
        if (onUpdate) onUpdate();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to leave club');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-card hover:shadow-xl transition-all duration-300 flex flex-col group">
      {/* Cover Image Header */}
      <div className="relative h-32 w-full bg-slate-900 overflow-hidden">
        <img
          src={club.coverImage || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80'}
          alt={club.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div>

        {/* Category Pill */}
        <div className="absolute top-3 right-3">
          <Badge variant="navy">{club.category}</Badge>
        </div>
      </div>

      {/* Profile Logo & Details */}
      <div className="px-6 pb-6 pt-0 flex-1 flex flex-col justify-between relative">
        <div>
          {/* Logo floating */}
          <div className="-mt-10 mb-3 flex items-end justify-between">
            <img
              src={club.logo || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&auto=format&fit=crop&q=80'}
              alt={club.name}
              className="w-16 h-16 rounded-2xl object-cover border-4 border-white shadow-md bg-white shrink-0"
            />
            <div className="text-right">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                <span>{club.memberCount || 0} Members</span>
              </span>
            </div>
          </div>

          <Link to={`/clubs/${club._id}`} className="block">
            <h3 className="text-base font-bold text-slate-900 group-hover:text-cyan-600 transition-colors line-clamp-1">
              {club.name}
            </h3>
          </Link>

          <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
            {club.description}
          </p>

          {/* Coordinators & Schedule */}
          <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-[11px] text-slate-600">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span className="font-semibold text-slate-700">Lead:</span>
              <span className="truncate">{club.studentLeader?.name || 'Alex Rivera'}</span>
            </div>

            <div className="flex items-center gap-2">
              <Building className="w-3.5 h-3.5 text-purple-500 shrink-0" />
              <span className="font-semibold text-slate-700">Faculty:</span>
              <span className="truncate">{club.facultyCoordinator?.name || 'Prof. Sarah'}</span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="truncate">{club.meetingSchedule}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
          <Link
            to={`/clubs/${club._id}`}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1"
          >
            <span>View Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {role === 'student' && (
            isMember ? (
              <button
                onClick={handleLeave}
                disabled={loading}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-semibold transition-colors disabled:opacity-50"
              >
                {loading ? '...' : 'Joined (Leave)'}
              </button>
            ) : (
              <button
                onClick={handleJoin}
                disabled={loading}
                className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold shadow-glow flex items-center gap-1.5 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{loading ? 'Joining...' : 'Join Club'}</span>
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ClubCard;
