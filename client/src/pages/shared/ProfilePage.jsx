import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  User,
  Mail,
  Phone,
  Building,
  GraduationCap,
  Github,
  Linkedin,
  Award,
  Edit2,
  Check,
  Sparkles,
} from 'lucide-react';

export const ProfilePage = () => {
  const { user, role, updateProfile } = useAuth();
  const { success, error } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    phone: '',
    avatar: '',
    bio: '',
    skills: '',
    githubUrl: '',
    linkedinUrl: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        department: user.department || '',
        phone: user.phone || '',
        avatar: user.avatar || '',
        bio: user.profile?.bio || 'Passionate student builder at CampusNumberOne',
        skills: Array.isArray(user.profile?.skills)
          ? user.profile.skills.join(', ')
          : user.profile?.skills || 'React, Node.js, Python',
        githubUrl: user.profile?.githubUrl || 'https://github.com/',
        linkedinUrl: user.profile?.linkedinUrl || 'https://linkedin.com/in/',
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const skillsArray = formData.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await updateProfile({
        ...formData,
        skills: skillsArray,
      });

      if (res.success) {
        success('Profile updated successfully');
        setIsEditing(false);
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Profile Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 sm:p-8 text-white shadow-2xl border border-slate-800">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`}
            alt={user?.name}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover bg-slate-800 border-4 border-slate-700 shadow-xl"
          />

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{user?.name}</h1>
              <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
                {role}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 font-medium">{user?.department}</p>
            <p className="text-xs text-slate-400 max-w-lg leading-relaxed">{formData.bio}</p>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 flex items-center gap-1.5 transition-all self-center sm:self-start"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Cancel Editing' : 'Edit Profile'}</span>
          </button>
        </div>
      </div>

      {/* Edit Form or Readonly View */}
      {isEditing ? (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-card space-y-4 text-xs">
          <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
            Edit Campus Profile
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 012-3456"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Avatar Image URL</label>
            <input
              type="url"
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
              placeholder="https://..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Bio / Headline</label>
            <textarea
              rows="3"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 resize-none"
            ></textarea>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Skills (comma-separated)</label>
            <input
              type="text"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              placeholder="React, Python, Docker, Cloud"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">GitHub Profile</label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">LinkedIn Profile</label>
              <input
                type="url"
                value={formData.linkedinUrl}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20"
            >
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Institutional Data Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-card space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900">Institutional Information</h3>
            <div className="space-y-3 text-slate-700">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="font-semibold">{user?.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Building className="w-4 h-4 text-purple-600 shrink-0" />
                <span>{user?.department}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{user?.phone || '+1 (555) 012-3456'}</span>
              </div>
            </div>
          </div>

          {/* Social Links & Technical Skills */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-card space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900">Technical Skills & Connect</h3>
            <div className="flex flex-wrap gap-1.5">
              {formData.skills.split(',').map((skill, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-xl bg-blue-50 text-blue-700 font-bold text-[11px]">
                  {skill.trim()}
                </span>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
              {formData.githubUrl && (
                <a
                  href={formData.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {formData.linkedinUrl && (
                <a
                  href={formData.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
