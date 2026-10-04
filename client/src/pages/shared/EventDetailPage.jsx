import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import eventService from '../../services/eventService';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Ticket,
  ArrowLeft,
  CheckCircle2,
  Share2,
  UserCheck,
  Building,
} from 'lucide-react';

export const EventDetailPage = () => {
  const { id } = useParams();
  const { user, role, isAuthenticated } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [myRegistration, setMyRegistration] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchEvent = async () => {
    setLoading(true);
    try {
      const res = await eventService.getEventById(id);
      if (res.success) {
        setEvent(res.event);
        setIsRegistered(res.isRegistered);
        setMyRegistration(res.myRegistration);
        setParticipants(res.participants || []);
      }
    } catch (err) {
      error('Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const handleRegister = async () => {
    if (!isAuthenticated) {
      error('Please sign in to register for events');
      return;
    }
    setActionLoading(true);
    try {
      const res = await eventService.registerForEvent(id);
      if (res.success) {
        success('Registration confirmed! Ticket generated.');
        fetchEvent();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to register');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    setActionLoading(true);
    try {
      const res = await eventService.cancelRegistration(id);
      if (res.success) {
        success('Registration cancelled');
        fetchEvent();
      }
    } catch (err) {
      error('Failed to cancel registration');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Loader fullPage message="Loading event information..." />;
  if (!event) return <div className="text-center py-12">Event not found</div>;

  const isFull = event.registeredCount >= event.maxParticipants;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Back button */}
      <Link
        to="/events"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Events List</span>
      </Link>

      {/* Main Banner Header */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-slate-900 border border-slate-800">
        <img
          src={event.bannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80'}
          alt={event.title}
          className="w-full h-72 sm:h-96 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <Badge variant="primary">{event.category}</Badge>
          {isRegistered && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-md">
              <CheckCircle2 className="w-3.5 h-3.5" /> Registered & Confirmed
            </span>
          )}
        </div>

        <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
          <p className="text-xs font-semibold text-cyan-300 uppercase tracking-widest">{event.organizer}</p>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">{event.title}</h1>
        </div>
      </div>

      {/* Content & Action Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2-Cols Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-card space-y-6">
            <h2 className="text-lg font-bold text-slate-900">Event Overview & Schedule</h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-2">
                {event.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Registered Participants Roster */}
          {(role === 'faculty' || role === 'admin') && (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">
                  Registered Participants ({participants.length})
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-600">
                  Faculty Roster View
                </span>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {participants.map((reg) => (
                  <div
                    key={reg._id}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={reg.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${reg.user?.name || 'User'}`}
                        alt={reg.user?.name}
                        className="w-7 h-7 rounded-xl object-cover bg-slate-200"
                      />
                      <div>
                        <p className="font-bold text-slate-800">{reg.user?.name}</p>
                        <p className="text-[10px] text-slate-400">{reg.user?.department}</p>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] font-bold text-slate-600">
                      {reg.ticketNumber}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right 1-Col Info Box */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-card space-y-6">
            <h3 className="text-base font-bold text-slate-900">Event Details</h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-800">Date</p>
                  <p className="text-slate-500">{event.date}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-800">Time</p>
                  <p className="text-slate-500">{event.time}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-800">Venue</p>
                  <p className="text-slate-500">{event.venue}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>Capacity</span>
                    <span>{event.registeredCount || 0} / {event.maxParticipants}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${Math.min(100, ((event.registeredCount || 0) / (event.maxParticipants || 100)) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ticket Card if Registered */}
            {isRegistered && myRegistration && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900 to-slate-950 text-white space-y-2 border border-blue-500/30">
                <div className="flex items-center justify-between text-xs font-bold text-cyan-400">
                  <span className="flex items-center gap-1"><Ticket className="w-4 h-4" /> DIGITAL PASS</span>
                  <span className="text-emerald-400">CONFIRMED</span>
                </div>
                <p className="text-sm font-extrabold">{user?.name}</p>
                <p className="text-xs font-mono text-cyan-300">Ticket: {myRegistration.ticketNumber}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-100">
              {isRegistered ? (
                <button
                  onClick={handleCancel}
                  disabled={actionLoading}
                  className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-rose-50 text-rose-600 font-bold text-xs transition-colors disabled:opacity-50"
                >
                  {actionLoading ? 'Cancelling...' : 'Cancel My Registration'}
                </button>
              ) : isFull ? (
                <button disabled className="w-full py-3 rounded-2xl bg-slate-100 text-slate-400 font-bold text-xs cursor-not-allowed">
                  Event Fully Booked
                </button>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={actionLoading}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold text-xs shadow-glow transition-all disabled:opacity-50"
                >
                  {actionLoading ? 'Securing Spot...' : 'Claim Registration Ticket'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
