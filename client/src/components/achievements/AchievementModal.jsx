import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import achievementService from '../../services/achievementService';
import { useToast } from '../../context/ToastContext';
import confetti from 'canvas-confetti';
import { Trophy, Sparkles } from 'lucide-react';

export const AchievementModal = ({ isOpen, onClose, achievementToEdit, onSaved }) => {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Hackathon',
    date: new Date().toISOString().split('T')[0],
    issuer: '',
    certificateUrl: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800&auto=format&fit=crop&q=80',
    proofLink: '',
    featured: true,
  });

  useEffect(() => {
    if (achievementToEdit) {
      setFormData({
        title: achievementToEdit.title || '',
        description: achievementToEdit.description || '',
        category: achievementToEdit.category || 'Hackathon',
        date: achievementToEdit.date || new Date().toISOString().split('T')[0],
        issuer: achievementToEdit.issuer || '',
        certificateUrl: achievementToEdit.certificateUrl || '',
        proofLink: achievementToEdit.proofLink || '',
        featured: Boolean(achievementToEdit.featured),
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: 'Hackathon',
        date: new Date().toISOString().split('T')[0],
        issuer: 'Tech Fest 2026',
        certificateUrl: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800&auto=format&fit=crop&q=80',
        proofLink: '',
        featured: true,
      });
    }
  }, [achievementToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (achievementToEdit) {
        const res = await achievementService.updateAchievement(achievementToEdit._id, formData);
        if (res.success) {
          success('Achievement updated');
          onSaved();
          onClose();
        }
      } else {
        const res = await achievementService.createAchievement(formData);
        if (res.success) {
          // Trigger celebratory confetti
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });

          success('Achievement showcased to your campus portfolio! 🏆');
          onSaved();
          onClose();
        }
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to save achievement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={achievementToEdit ? 'Edit Achievement' : 'Showcase New Achievement'}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Achievement / Award Title</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. 1st Place National Winner - Smart India Hackathon"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 bg-white"
            >
              <option value="Hackathon">Hackathon</option>
              <option value="Certification">Certification</option>
              <option value="Internship">Internship</option>
              <option value="Academic">Academic Honor</option>
              <option value="Project">Project Milestone</option>
              <option value="Sports">Sports Championship</option>
              <option value="Publication">Research Publication</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Issuing Organization / Event</label>
            <input
              type="text"
              required
              value={formData.issuer}
              onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
              placeholder="e.g. AWS, IEEE, Ministry of Education"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Date Achieved</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Verification / Credly Link</label>
            <input
              type="url"
              value={formData.proofLink}
              onChange={(e) => setFormData({ ...formData, proofLink: e.target.value })}
              placeholder="https://..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Certificate / Trophy Image URL</label>
          <input
            type="url"
            value={formData.certificateUrl}
            onChange={(e) => setFormData({ ...formData, certificateUrl: e.target.value })}
            placeholder="https://images.unsplash.com/..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Description & Impact</label>
          <textarea
            rows="3"
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Briefly describe the challenge, solution, and what you learned..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 resize-none"
          ></textarea>
        </div>

        <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
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
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20 flex items-center gap-1.5"
          >
            <Trophy className="w-4 h-4" />
            <span>{loading ? 'Saving...' : achievementToEdit ? 'Save Changes' : 'Showcase Achievement'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AchievementModal;
