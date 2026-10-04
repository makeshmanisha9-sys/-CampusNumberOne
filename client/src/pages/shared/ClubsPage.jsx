import React, { useState, useEffect } from 'react';
import clubService from '../../services/clubService';
import ClubCard from '../../components/clubs/ClubCard';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { Search, Users, Sparkles } from 'lucide-react';

export const ClubsPage = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const categories = ['All', 'Technical', 'Arts & Culture', 'Sports', 'Media & Photography', 'Literature', 'Innovation & E-Cell'];

  const fetchClubs = async () => {
    setLoading(true);
    try {
      const res = await clubService.getClubs({
        search,
        category: category === 'All' ? undefined : category,
      });
      if (res.success) {
        setClubs(res.clubs || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, [category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchClubs();
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <span>Campus Clubs & Student Societies</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Explore student-run technical guilds, photography societies, culture hubs, and venture incubators.
        </p>
      </div>

      {/* Search & Categories */}
      <div className="space-y-4">
        <form onSubmit={handleSearchSubmit} className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clubs by name or interests..."
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

      {/* Clubs Grid */}
      {loading ? (
        <Loader message="Loading campus student clubs..." />
      ) : clubs.length === 0 ? (
        <EmptyState
          icon="folder"
          title="No clubs found"
          message={`No active clubs found in "${category}" category.`}
          actionText="Reset Filter"
          onAction={() => {
            setSearch('');
            setCategory('All');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club) => (
            <ClubCard key={club._id} club={club} onUpdate={fetchClubs} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ClubsPage;
