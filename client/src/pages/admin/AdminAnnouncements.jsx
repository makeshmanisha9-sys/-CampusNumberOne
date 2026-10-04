import React, { useState, useEffect } from 'react';
import announcementService from '../../services/announcementService';
import AnnouncementCard from '../../components/announcements/AnnouncementCard';
import AnnouncementModal from '../../components/announcements/AnnouncementModal';
import Loader from '../../components/common/Loader';
import { PlusCircle, Megaphone } from 'lucide-react';

export const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [annToEdit, setAnnToEdit] = useState(null);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await announcementService.getAnnouncements();
      if (res.success) setAnnouncements(res.announcements || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  if (loading) return <Loader fullPage message="Loading official broadcasts..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Institutional Announcements & Circulars</h2>
          <p className="text-xs text-slate-500">Publish high-priority notices, examination schedules, and alerts</p>
        </div>
        <button
          onClick={() => {
            setAnnToEdit(null);
            setShowModal(true);
          }}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-glow flex items-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Broadcast</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {announcements.map((ann) => (
          <AnnouncementCard
            key={ann._id}
            announcement={ann}
            onUpdate={fetchAnnouncements}
            onEdit={(item) => {
              setAnnToEdit(item);
              setShowModal(true);
            }}
          />
        ))}
      </div>

      {showModal && (
        <AnnouncementModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          announcementToEdit={annToEdit}
          onSaved={fetchAnnouncements}
        />
      )}
    </div>
  );
};

export default AdminAnnouncements;
