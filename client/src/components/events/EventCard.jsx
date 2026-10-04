import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import eventService from '../../services/eventService';
import Badge from '../common/Badge';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Ticket,
  ArrowRight,
  CheckCircle2,
  Trash2,
  Edit,
  UserCheck,
} from 'lucide-react';

export const EventCard = ({ event, onUpdate, onEdit }) => {
  const { user, role, isAuthenticated } = useAuth();
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);

  const isRegistered = event.isRegistered;
  const isFull = event.registeredCount >= event.maxParticipants;
  const isCreator = user && (event.createdBy?._id === user._id || event.createdBy === user._id);
  const canManage = role === 'admin' || (role === 'faculty' && isCreator);

  const handleRegister = async () => {
    if (!isAuthenticated) {
      error('Please sign in to register for campus events');
      return;
    }
    setLoading(true);
    try {
      const res = await eventService.registerForEvent(event._id);
      if (res.success) {
        success(`Registered for ${event.title}! Ticket: ${res.registration?.ticketNumber || 'Confirmed'}`);
        if (onUpdate) onUpdate();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to register for event');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    setLoading(true);
    try {
      const res = await eventService.cancelRegistration(event._id);
      if (res.success) {
        success('Registration cancelled');
        if (onUpdate) onUpdate();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to cancel registration');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${event.title}"?`)) return;
    try {
      const res = await eventService.deleteEvent(event._id);
      if (res.success) {
        success('Event deleted');
        if (onUpdate) onUpdate();
      }
    } catch (err) {
      error('Failed to delete event');
    }
  };

  const getCategoryBadgeVariant = (cat) => {
    switch (cat) {
      case 'Hackathon': return 'purple';
      case 'Technical': return 'primary';
      case 'Cultural': return 'cyan';
      case 'Sports': return 'success';
      case 'Workshop': return 'warning';
      default: return 'neutral';
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-card hover:shadow-xl transition-all duration-300 flex flex-col group">
      {/* Banner */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-900">
        <img
          src={event.bannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80'}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <Badge variant={getCategoryBadgeVariant(event.category)}>
            {event.category}
          </Badge>

          {isRegistered && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500 text-white shadow-md">
              <CheckCircle2 className="w-3 h-3" /> Registered
            </span>
          )}
        </div>

        {/* Organizer */}
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-[11px] font-semibold text-cyan-300 tracking-wide truncate">
            {event.organizer}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <Link to={`/events/${event._id}`} className="block">
            <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
              {event.title}
            </h3>
          </Link>
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Meta Info */}
        <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span className="font-medium text-slate-700">{event.date}</span>
            <span className="text-slate-300">•</span>
            <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span className="truncate">{event.time}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>

          {/* Capacity Progress Bar */}
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500 flex items-center gap-1">
                <Users className="w-3 h-3" /> Seats Booked
              </span>
              <span className="font-bold text-slate-700">
                {event.registeredCount || 0} / {event.maxParticipants}
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isFull ? 'bg-rose-500' : 'bg-gradient-to-r from-blue-500 to-cyan-400'
                }`}
                style={{
                  width: `${Math.min(100, ((event.registeredCount || 0) / (event.maxParticipants || 100)) * 100)}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <Link
            to={`/events/${event._id}`}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <div className="flex items-center gap-1.5">
            {canManage && (
              <>
                {onEdit && (
                  <button
                    onClick={() => onEdit(event)}
                    className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    title="Edit Event"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={handleDelete}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Delete Event"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}

            {isRegistered ? (
              <button
                onClick={handleCancel}
                disabled={loading}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-semibold transition-colors disabled:opacity-50"
              >
                {loading ? '...' : 'Cancel Registration'}
              </button>
            ) : isFull ? (
              <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-400 text-xs font-semibold cursor-not-allowed">
                Housefull
              </span>
            ) : (
              <button
                onClick={handleRegister}
                disabled={loading}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>{loading ? 'Booking...' : 'Register'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
