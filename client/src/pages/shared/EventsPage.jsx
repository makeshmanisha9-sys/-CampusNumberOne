import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import eventService from '../../services/eventService';
import EventCard from '../../components/events/EventCard';
import EventModal from '../../components/events/EventModal';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { Search, PlusCircle, Calendar, Filter, Sparkles } from 'lucide-react';

export const EventsPage = () => {
  const { role } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);

  const categories = ['All', 'Technical', 'Hackathon', 'Workshop', 'Cultural', 'Sports', 'Seminar', 'Career'];

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await eventService.getEvents({
        search,
        category: category === 'All' ? undefined : category,
      });
      if (res.success) {
        setEvents(res.events || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEvents();
  };

  const canCreate = role === 'faculty' || role === 'admin';

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Campus Events & Hackathons</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Discover workshops, fests, sports championships, and national 36-hr coding sprints.
          </p>
        </div>

        {canCreate && (
          <button
            onClick={() => {
              setEventToEdit(null);
              setShowModal(true);
            }}
            className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all self-start md:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Campus Event</span>
          </button>
        )}
      </div>

      {/* Search & Category Filter Pills */}
      <div className="space-y-4">
        <form onSubmit={handleSearchSubmit} className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events by title, organizer, or venue..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 shadow-sm"
          />
        </form>

        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                category === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <Loader message="Fetching upcoming campus events..." />
      ) : events.length === 0 ? (
        <EmptyState
          icon="calendar"
          title="No events found"
          message={`No active events matching "${category}" category or your search term.`}
          actionText={canCreate ? 'Create an Event' : 'Reset Filters'}
          onAction={() => {
            if (canCreate) setShowModal(true);
            else {
              setSearch('');
              setCategory('All');
            }
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((ev) => (
            <EventCard
              key={ev._id}
              event={ev}
              onUpdate={fetchEvents}
              onEdit={(item) => {
                setEventToEdit(item);
                setShowModal(true);
              }}
            />
          ))}
        </div>
      )}

      {showModal && (
        <EventModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          eventToEdit={eventToEdit}
          onSaved={fetchEvents}
        />
      )}
    </div>
  );
};

export default EventsPage;
