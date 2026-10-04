import React, { useState, useEffect } from 'react';
import eventService from '../../services/eventService';
import EventCard from '../../components/events/EventCard';
import EventModal from '../../components/events/EventModal';
import Loader from '../../components/common/Loader';
import { PlusCircle, Calendar } from 'lucide-react';

export const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await eventService.getEvents();
      if (res.success) setEvents(res.events || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  if (loading) return <Loader fullPage message="Loading all campus events..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Campus Events Directory & Administration</h2>
          <p className="text-xs text-slate-500">Create, modify schedules, manage seat quotas, and delete events</p>
        </div>
        <button
          onClick={() => {
            setEventToEdit(null);
            setShowModal(true);
          }}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Publish New Event</span>
        </button>
      </div>

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

export default AdminEvents;
