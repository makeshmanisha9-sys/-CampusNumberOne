import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import eventService from '../../services/eventService';
import { useToast } from '../../context/ToastContext';

export const EventModal = ({ isOpen, onClose, eventToEdit, onSaved }) => {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '10:00 AM - 04:00 PM',
    venue: '',
    organizer: '',
    category: 'Technical',
    bannerImage: '',
    registrationDeadline: '',
    maxParticipants: 100,
    tags: 'Campus, Technical',
  });

  useEffect(() => {
    if (eventToEdit) {
      setFormData({
        title: eventToEdit.title || '',
        description: eventToEdit.description || '',
        date: eventToEdit.date || '',
        time: eventToEdit.time || '10:00 AM - 04:00 PM',
        venue: eventToEdit.venue || '',
        organizer: eventToEdit.organizer || '',
        category: eventToEdit.category || 'Technical',
        bannerImage: eventToEdit.bannerImage || '',
        registrationDeadline: eventToEdit.registrationDeadline || '',
        maxParticipants: eventToEdit.maxParticipants || 100,
        tags: Array.isArray(eventToEdit.tags) ? eventToEdit.tags.join(', ') : 'Campus',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        time: '10:00 AM - 04:00 PM',
        venue: 'Auditorium Hall A',
        organizer: 'Campus Tech Council',
        category: 'Technical',
        bannerImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
        registrationDeadline: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
        maxParticipants: 100,
        tags: 'Campus, Innovation, Technical',
      });
    }
  }, [eventToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (eventToEdit) {
        const res = await eventService.updateEvent(eventToEdit._id, formData);
        if (res.success) {
          success('Event updated successfully');
          onSaved();
          onClose();
        }
      } else {
        const res = await eventService.createEvent(formData);
        if (res.success) {
          success('Event created and published to campus!');
          onSaved();
          onClose();
        }
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={eventToEdit ? 'Edit Campus Event' : 'Create New Campus Event'}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Event Title</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. AI & Robotics Hackathon 2026"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 bg-white transition-colors"
            >
              <option value="Technical">Technical</option>
              <option value="Hackathon">Hackathon</option>
              <option value="Workshop">Workshop</option>
              <option value="Seminar">Seminar</option>
              <option value="Cultural">Cultural</option>
              <option value="Sports">Sports</option>
              <option value="Career">Career & Placement</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Organizer / Club</label>
            <input
              type="text"
              required
              value={formData.organizer}
              onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
              placeholder="e.g. ByteCraft Coding Club"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Event Date</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Time Schedule</label>
            <input
              type="text"
              required
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              placeholder="e.g. 10:00 AM - 04:30 PM"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Venue / Room</label>
            <input
              type="text"
              required
              value={formData.venue}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              placeholder="e.g. Turing Auditorium Hall B"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Registration Deadline</label>
            <input
              type="date"
              required
              value={formData.registrationDeadline}
              onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Max Participant Capacity</label>
            <input
              type="number"
              min="10"
              max="2000"
              required
              value={formData.maxParticipants}
              onChange={(e) => setFormData({ ...formData, maxParticipants: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Tags (comma separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="Hackathon, AI, Tech"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Banner Image URL</label>
          <input
            type="url"
            value={formData.bannerImage}
            onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })}
            placeholder="https://images.unsplash.com/..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Detailed Description</label>
          <textarea
            rows="3"
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe the agenda, rules, prizes, and eligibility criteria..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 transition-colors resize-none"
          ></textarea>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20 disabled:opacity-50"
          >
            {loading ? 'Saving Event...' : eventToEdit ? 'Save Changes' : 'Publish Event'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EventModal;
