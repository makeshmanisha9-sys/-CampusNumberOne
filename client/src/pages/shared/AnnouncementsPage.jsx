import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import announcementService from '../../services/announcementService';
import AnnouncementCard from '../../components/announcements/AnnouncementCard';
import AnnouncementModal from '../../components/announcements/AnnouncementModal';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { Search, PlusCircle, Megaphone, Filter } from 'lucide-react';

export const AnnouncementsPage = () => {
  const { role } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [annToEdit, setAnnToEdit] = useState(null);

  const categories = ['All', 'Academic', 'Examination', 'Placement', 'Events', 'General', 'Emergency'];

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await announcementService.getAnnouncements({
        search,
        category: category === 'All' ? undefined : category,
      });
      if (res.success) {
        setAnnouncements(res.announcements || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAnnouncements();
  };

  const canCreate = role === 'faculty' || role === 'admin';

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Official Campus Announcements</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time circulars for examinations, placements, academic notices, and emergency advisories.
          </p>
        </div>

        {canCreate && (
          <button
            onClick={() => {
              setAnnToEdit(null);
              setShowModal(true);
            }}
            className="px-4 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-glow flex items-center gap-1.5 transition-all self-start md:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Broadcast Announcement</span>
          </button>
        )}
      </div>

      {/* Filter and Search */}
      <div className="space-y-4">
        <form onSubmit={handleSearchSubmit} className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search announcements by topic or department..."
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
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Announcements List */}
      {loading ? (
        <Loader message="Fetching latest announcements..." />
      ) : announcements.length === 0 ? (
        <EmptyState
          icon="bell"
          title="No announcements found"
          message={`No announcements matching category "${category}" or search criteria.`}
          actionText={canCreate ? 'Create an Announcement' : 'Reset Filter'}
          onAction={() => {
            if (canCreate) setShowModal(true);
            else {
              setSearch('');
              setCategory('All');
            }
          }}
        />
      ) : (
        <div className="space-y-4">
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
      )}

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

export default AnnouncementsPage;
