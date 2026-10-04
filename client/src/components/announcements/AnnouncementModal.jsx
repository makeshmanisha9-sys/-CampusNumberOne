import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import announcementService from '../../services/announcementService';
import { useToast } from '../../context/ToastContext';

export const AnnouncementModal = ({ isOpen, onClose, announcementToEdit, onSaved }) => {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'General',
    priority: 'Normal',
    isPinned: false,
    targetAudience: 'All',
    department: 'Academic Affairs',
  });

  useEffect(() => {
    if (announcementToEdit) {
      setFormData({
        title: announcementToEdit.title || '',
        content: announcementToEdit.content || '',
        category: announcementToEdit.category || 'General',
        priority: announcementToEdit.priority || 'Normal',
        isPinned: Boolean(announcementToEdit.isPinned),
        targetAudience: announcementToEdit.targetAudience || 'All',
        department: announcementToEdit.department || 'Academic Affairs',
      });
    } else {
      setFormData({
        title: '',
        content: '',
        category: 'General',
        priority: 'Normal',
        isPinned: false,
        targetAudience: 'All',
        department: 'Academic Affairs',
      });
    }
  }, [announcementToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (announcementToEdit) {
        const res = await announcementService.updateAnnouncement(announcementToEdit._id, formData);
        if (res.success) {
          success('Announcement updated');
          onSaved();
          onClose();
        }
      } else {
        const res = await announcementService.createAnnouncement(formData);
        if (res.success) {
          success('Announcement published and broadcasted to campus');
          onSaved();
          onClose();
        }
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to save announcement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={announcementToEdit ? 'Edit Announcement' : 'Publish Campus Announcement'}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Headline / Title</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Autumn Semester Final Exam Schedule"
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
              <option value="Academic">Academic</option>
              <option value="Examination">Examination</option>
              <option value="Placement">Placement</option>
              <option value="Events">Events</option>
              <option value="General">General</option>
              <option value="Emergency">Emergency</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Priority Level</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 bg-white transition-colors"
            >
              <option value="Normal">Normal</option>
              <option value="High">High Priority</option>
              <option value="Urgent">Urgent Alert</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Target Audience</label>
            <select
              value={formData.targetAudience}
              onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 bg-white transition-colors"
            >
              <option value="All">All Campus Members</option>
              <option value="Students">Students Only</option>
              <option value="Faculty">Faculty Only</option>
              <option value="Final Year">Final Year Graduating Batch</option>
              <option value="First Year">First Year Freshers</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Issuing Department</label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              placeholder="e.g. Dean Academic Affairs"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
          <input
            type="checkbox"
            id="pinAnnouncement"
            checked={formData.isPinned}
            onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
          />
          <label htmlFor="pinAnnouncement" className="font-semibold text-slate-800 cursor-pointer">
            Pin to top of campus dashboard and announcements feed
          </label>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Detailed Content</label>
          <textarea
            rows="5"
            required
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Write full announcement details, instructions, links, or dates..."
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
            {loading ? 'Publishing...' : announcementToEdit ? 'Save Changes' : 'Broadcast Now'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AnnouncementModal;
