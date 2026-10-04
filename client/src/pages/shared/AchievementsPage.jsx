import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import achievementService from '../../services/achievementService';
import AchievementCard from '../../components/achievements/AchievementCard';
import AchievementModal from '../../components/achievements/AchievementModal';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { Trophy, PlusCircle, Sparkles, Filter, Award } from 'lucide-react';

export const AchievementsPage = () => {
  const { isAuthenticated } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [achToEdit, setAchToEdit] = useState(null);

  const categories = ['All', 'Hackathon', 'Certification', 'Internship', 'Academic', 'Project', 'Sports', 'Publication'];

  const fetchAchievements = async () => {
    setLoading(true);
    try {
      const res = await achievementService.getAchievements({
        category: category === 'All' ? undefined : category,
      });
      if (res.success) {
        setAchievements(res.achievements || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, [category]);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Student Achievement Portfolios</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Showcase and celebrate hackathon victories, cloud certifications, research papers, and internships.
          </p>
        </div>

        {isAuthenticated && (
          <button
            onClick={() => {
              setAchToEdit(null);
              setShowModal(true);
            }}
            className="px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 flex items-center gap-1.5 transition-all self-start md:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Showcase Achievement</span>
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              category === cat
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <Loader message="Loading student achievements..." />
      ) : achievements.length === 0 ? (
        <EmptyState
          icon="award"
          title="No achievements found"
          message={`No portfolio items found in "${category}" category.`}
          actionText={isAuthenticated ? 'Add Your First Achievement' : null}
          onAction={() => setShowModal(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((ach) => (
            <AchievementCard
              key={ach._id}
              achievement={ach}
              onUpdate={fetchAchievements}
              onEdit={(item) => {
                setAchToEdit(item);
                setShowModal(true);
              }}
            />
          ))}
        </div>
      )}

      {showModal && (
        <AchievementModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          achievementToEdit={achToEdit}
          onSaved={fetchAchievements}
        />
      )}
    </div>
  );
};

export default AchievementsPage;
