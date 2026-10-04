import React, { useState, useEffect } from 'react';
import clubService from '../../services/clubService';
import ClubCard from '../../components/clubs/ClubCard';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';
import { PlusCircle, School } from 'lucide-react';

export const AdminClubs = () => {
  const { success, error } = useToast();
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Technical',
    description: '',
    logo: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop&q=80',
    meetingSchedule: 'Wednesdays at 4:30 PM',
  });

  const fetchClubs = async () => {
    setLoading(true);
    try {
      const res = await clubService.getClubs();
      if (res.success) setClubs(res.clubs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  const handleCreateClub = async (e) => {
    e.preventDefault();
    try {
      const res = await clubService.createClub(formData);
      if (res.success) {
        success('New student club chartered successfully');
        setShowModal(false);
        fetchClubs();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to create club');
    }
  };

  if (loading) return <Loader fullPage message="Loading student societies..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Chartered Student Clubs & Societies</h2>
          <p className="text-xs text-slate-500">Manage student organizations, leadership coordinators, and charters</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-glow flex items-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Charter New Club</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clubs.map((club) => (
          <ClubCard key={club._id} club={club} onUpdate={fetchClubs} />
        ))}
      </div>

      {showModal && (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Charter New Campus Club">
          <form onSubmit={handleCreateClub} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Club Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Quantum Computing & Web3 Guild"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 bg-white"
              >
                <option value="Technical">Technical</option>
                <option value="Arts & Culture">Arts & Culture</option>
                <option value="Sports">Sports</option>
                <option value="Media & Photography">Media & Photography</option>
                <option value="Literature">Literature & Debating</option>
                <option value="Innovation & E-Cell">Innovation & E-Cell</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Meeting Schedule</label>
              <input
                type="text"
                required
                value={formData.meetingSchedule}
                onChange={(e) => setFormData({ ...formData, meetingSchedule: e.target.value })}
                placeholder="Every Thursday at 5:00 PM (Lab 2)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Description & Charter</label>
              <textarea
                rows="3"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="State the club objectives and student activities..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 resize-none"
              ></textarea>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
              >
                Create Charter
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AdminClubs;
