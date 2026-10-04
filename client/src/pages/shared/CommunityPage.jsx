import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import postService from '../../services/postService';
import CreatePostCard from '../../components/community/CreatePostCard';
import PostCard from '../../components/community/PostCard';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { MessageSquare, Sparkles, TrendingUp, Filter, Hash } from 'lucide-react';

export const CommunityPage = () => {
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [selectedTag, setSelectedTag] = useState('');

  const categories = ['All', 'General', 'Project', 'Question', 'Achievement', 'Campus Life', 'Opportunity'];
  const popularTags = ['hackathon', 'ai', 'opensource', 'uiux', 'placement', 'systemdesign'];

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await postService.getPosts({
        category: category === 'All' ? undefined : category,
        tag: selectedTag || undefined,
      });
      if (res.success) {
        setPosts(res.posts || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [category, selectedTag]);

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handlePostDeleted = (postId) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <span>Campus Community Social Feed</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Connect with peers, share technical projects, celebrate hackathon wins, and find study group partners.
        </p>
      </div>

      {/* Post Creator */}
      <CreatePostCard onPostCreated={handlePostCreated} />

      {/* Categories & Trending Tags */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat);
                setSelectedTag('');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                category === cat && !selectedTag
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-bold flex items-center gap-1 shrink-0">
            <TrendingUp className="w-3.5 h-3.5 text-cyan-500" /> Trending:
          </span>
          {popularTags.map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setSelectedTag(selectedTag === tag ? '' : tag);
                setCategory('All');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                selectedTag === tag
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Feed */}
      {loading ? (
        <Loader message="Loading campus conversations..." />
      ) : posts.length === 0 ? (
        <EmptyState
          icon="sparkles"
          title="No posts in this feed"
          message="Be the first to share an update or start a conversation in the community!"
          actionText="Clear Filter"
          onAction={() => {
            setCategory('All');
            setSelectedTag('');
          }}
        />
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} onDeleted={handlePostDeleted} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityPage;
