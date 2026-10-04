import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import announcementService from '../../services/announcementService';
import Badge from '../common/Badge';
import {
  Pin,
  Calendar,
  Building,
  User,
  Trash2,
  Edit,
  Download,
  FileText,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const AnnouncementCard = ({ announcement, onUpdate, onEdit }) => {
  const { user, role } = useAuth();
  const { success, error } = useToast();
  const [expanded, setExpanded] = useState(false);

  const isAuthor = user && (announcement.author?._id === user._id || announcement.author === user._id);
  const canManage = role === 'admin' || (role === 'faculty' && isAuthor);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    try {
      const res = await announcementService.deleteAnnouncement(announcement._id);
      if (res.success) {
        success('Announcement removed');
        if (onUpdate) onUpdate();
      }
    } catch (err) {
      error('Failed to delete announcement');
    }
  };

  const getPriorityBadgeVariant = (p) => {
    switch (p) {
      case 'Urgent': return 'danger';
      case 'High': return 'warning';
      case 'Normal': return 'primary';
      default: return 'neutral';
    }
  };

  return (
    <div
      className={`rounded-3xl p-6 transition-all duration-300 border ${
        announcement.isPinned
          ? 'bg-gradient-to-r from-blue-50/70 via-white to-cyan-50/40 border-cyan-300 shadow-md ring-1 ring-cyan-200'
          : 'bg-white border-slate-200/90 shadow-card hover:shadow-lg'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        {/* Badges & Category */}
        <div className="flex flex-wrap items-center gap-2">
          {announcement.isPinned && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-cyan-500 text-slate-950 shadow-glow">
              <Pin className="w-3 h-3 fill-slate-950" /> Pinned Priority
            </span>
          )}

          <Badge variant={getPriorityBadgeVariant(announcement.priority)} dot>
            {announcement.priority}
          </Badge>

          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            {announcement.category}
          </span>
        </div>

        {/* Date */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Calendar className="w-3.5 h-3.5" />
          <span>{new Date(announcement.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="mt-4 space-y-2">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
          {announcement.title}
        </h3>

        <p className={`text-xs text-slate-600 leading-relaxed ${!expanded && 'line-clamp-3'}`}>
          {announcement.content}
        </p>

        {announcement.content.length > 200 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 pt-1"
          >
            <span>{expanded ? 'Show Less' : 'Read Full Announcement'}</span>
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {/* Attachments if any */}
      {announcement.attachments && announcement.attachments.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-2">
          {announcement.attachments.map((att, idx) => (
            <a
              key={idx}
              href={att.fileUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-blue-500" />
              <span className="truncate max-w-xs">{att.fileName || 'Attachment Document'}</span>
              <Download className="w-3 h-3 text-slate-400" />
            </a>
          ))}
        </div>
      )}

      {/* Author Details & Admin Actions */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={announcement.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${announcement.author?.name || 'Faculty'}`}
            alt={announcement.author?.name}
            className="w-7 h-7 rounded-xl object-cover bg-slate-200 shrink-0"
          />
          <div className="truncate">
            <p className="font-bold text-slate-800 truncate">{announcement.author?.name || 'Campus Administrator'}</p>
            <p className="text-[10px] text-slate-400 truncate">{announcement.department || 'Academic Affairs'}</p>
          </div>
        </div>

        {canManage && (
          <div className="flex items-center gap-1">
            {onEdit && (
              <button
                onClick={() => onEdit(announcement)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                title="Edit Announcement"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={handleDelete}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Delete Announcement"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementCard;
