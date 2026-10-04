import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import achievementService from '../../services/achievementService';
import Badge from '../common/Badge';
import {
  Trophy,
  Award,
  Heart,
  ExternalLink,
  Trash2,
  Edit,
  CheckCircle2,
  Sparkles,
  Calendar,
} from 'lucide-react';

export const AchievementCard = ({ achievement, onUpdate, onEdit }) => {
  const { user, role, isAuthenticated } = useAuth();
  const { success, error } = useToast();
  const [liked, setLiked] = useState(achievement.isLiked || false);
  const [likeCount, setLikeCount] = useState(achievement.likeCount || 0);

  const isOwner = user && (achievement.user?._id === user._id || achievement.user === user._id);
  const canManage = isOwner || role === 'admin';

  const handleLike = async () => {
    if (!isAuthenticated) {
      error('Please sign in to cheer achievements');
      return;
    }

    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));

    try {
      const res = await achievementService.toggleLikeAchievement(achievement._id);
      if (res.success) {
        setLiked(res.isLiked);
        setLikeCount(res.likeCount);
      }
    } catch (err) {
      setLiked(liked);
      setLikeCount(likeCount);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this achievement entry from your profile?')) return;
    try {
      const res = await achievementService.deleteAchievement(achievement._id);
      if (res.success) {
        success('Achievement removed');
        if (onUpdate) onUpdate();
      }
    } catch (err) {
      error('Failed to delete achievement');
    }
  };

  const getCategoryBadgeVariant = (cat) => {
    switch (cat) {
      case 'Hackathon': return 'purple';
      case 'Certification': return 'cyan';
      case 'Academic': return 'primary';
      case 'Internship': return 'success';
      case 'Sports': return 'warning';
      default: return 'neutral';
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-card hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
      {/* Thumbnail */}
      <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
        <img
          src={achievement.certificateUrl || 'https://images.unsplash.com/photo-1579389083078-4e7018379f7e?w=800&auto=format&fit=crop&q=80'}
          alt={achievement.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

        {/* Category & Verification Badge */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <Badge variant={getCategoryBadgeVariant(achievement.category)}>
            {achievement.category}
          </Badge>

          {achievement.isVerified && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500 text-white shadow-md">
              <CheckCircle2 className="w-3 h-3" /> Verified Certificate
            </span>
          )}
        </div>

        {/* Issuer */}
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-[11px] font-semibold text-cyan-300 truncate">
            {achievement.issuer}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {achievement.title}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
            {achievement.description}
          </p>
        </div>

        {/* Student Name & Date */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <img
              src={achievement.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${achievement.user?.name || 'Student'}`}
              alt={achievement.user?.name}
              className="w-6 h-6 rounded-lg object-cover bg-slate-100"
            />
            <span className="font-semibold text-slate-700 truncate max-w-[120px]">
              {achievement.user?.name || 'Alex Rivera'}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>{achievement.date}</span>
          </div>
        </div>

        {/* Actions & Cheers */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              liked
                ? 'bg-rose-50 text-rose-600 font-bold'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{likeCount} Cheers</span>
          </button>

          <div className="flex items-center gap-1">
            {achievement.proofLink && (
              <a
                href={achievement.proofLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                title="Open Proof Link"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            {canManage && (
              <>
                {onEdit && (
                  <button
                    onClick={() => onEdit(achievement)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={handleDelete}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementCard;
