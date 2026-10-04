import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import postService from '../../services/postService';
import {
  Image,
  Send,
  Sparkles,
  Tag,
  Smile,
  X,
} from 'lucide-react';

export const CreatePostCard = ({ onPostCreated }) => {
  const { user, isAuthenticated } = useAuth();
  const { success, error } = useToast();
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [category, setCategory] = useState('General');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthenticated) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      const res = await postService.createPost({
        content,
        images: imageUrl.trim() ? [imageUrl.trim()] : [],
        category,
        tags,
      });

      if (res.success) {
        success('Your post is live in the campus community!');
        setContent('');
        setImageUrl('');
        setShowImageInput(false);
        setTags('');
        if (onPostCreated) onPostCreated(res.post);
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-card space-y-4">
      <div className="flex items-start gap-3">
        <img
          src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`}
          alt={user?.name}
          className="w-10 h-10 rounded-2xl object-cover bg-slate-100 border border-slate-200 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <textarea
            rows="3"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`What's on your mind, ${user?.name?.split(' ')[0] || 'fellow student'}? Share projects, ask questions, or announce achievements...`}
            className="w-full text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 bg-slate-50 rounded-2xl p-3 border border-slate-200 focus:outline-none focus:border-blue-500 focus:bg-white transition-all resize-none"
          ></textarea>
        </div>
      </div>

      {showImageInput && (
        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <Image className="w-4 h-4 text-cyan-500 shrink-0" />
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Paste image URL (e.g. Unsplash, imgur)..."
            className="flex-1 bg-transparent border-none text-xs text-slate-800 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowImageInput(false)}
            className="p-1 text-slate-400 hover:text-slate-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          {/* Category Picker */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 border-none font-semibold text-slate-700 text-xs focus:ring-0 cursor-pointer"
          >
            <option value="General">General</option>
            <option value="Project">Project Showcase</option>
            <option value="Question">Study Question</option>
            <option value="Achievement">Achievement</option>
            <option value="Campus Life">Campus Life</option>
            <option value="Opportunity">Opportunity</option>
          </select>

          {/* Add Image Button */}
          <button
            type="button"
            onClick={() => setShowImageInput(!showImageInput)}
            className={`p-2 rounded-xl font-medium flex items-center gap-1.5 transition-colors ${
              showImageInput || imageUrl
                ? 'bg-cyan-50 text-cyan-600 border border-cyan-200'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Image className="w-4 h-4" />
            <span className="hidden sm:inline">Image</span>
          </button>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading || !content.trim()}
          className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{loading ? 'Posting...' : 'Share Post'}</span>
        </button>
      </div>
    </div>
  );
};

export default CreatePostCard;
