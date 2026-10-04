import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import postService from '../../services/postService';
import CommentSection from './CommentSection';
import ReportModal from './ReportModal';
import Badge from '../common/Badge';
import {
  Heart,
  MessageCircle,
  Share2,
  Trash2,
  Flag,
  Sparkles,
  Pin,
  Tag,
} from 'lucide-react';

export const PostCard = ({ post, onDeleted }) => {
  const { user, role, isAuthenticated } = useAuth();
  const { success, error } = useToast();
  const [liked, setLiked] = useState(post.isLiked || false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(post.commentCount || 0);
  const [showReportModal, setShowReportModal] = useState(false);

  const isAuthor = user && (post.author?._id === user._id || post.author === user._id);
  const canDelete = isAuthor || role === 'admin';

  const handleLike = async () => {
    if (!isAuthenticated) {
      error('Please sign in to like posts');
      return;
    }

    // Optimistic UI update
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));

    try {
      const res = await postService.toggleLikePost(post._id);
      if (res.success) {
        setLiked(res.isLiked);
        setLikeCount(res.likeCount);
      }
    } catch (err) {
      // Revert if error
      setLiked(liked);
      setLikeCount(likeCount);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      const res = await postService.deletePost(post._id);
      if (res.success) {
        success('Post deleted');
        if (onDeleted) onDeleted(post._id);
      }
    } catch (err) {
      error('Failed to delete post');
    }
  };

  return (
    <>
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-card hover:shadow-lg transition-all duration-300">
        {/* Author Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={post.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author?.name || 'User'}`}
              alt={post.author?.name}
              className="w-10 h-10 rounded-2xl object-cover bg-slate-100 border border-slate-200 shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                  {post.author?.name || 'Campus Student'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 capitalize">
                  {post.author?.role || 'student'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 truncate">
                {post.author?.department || 'Computer Science'} • {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Badge variant="primary" className="text-[10px]">
              {post.category || 'General'}
            </Badge>

            {canDelete ? (
              <button
                onClick={handleDelete}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Delete Post"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setShowReportModal(true)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                title="Report Post"
              >
                <Flag className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="mt-4 space-y-3">
          <p className="text-xs sm:text-sm text-slate-800 whitespace-pre-line leading-relaxed">
            {post.content}
          </p>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {post.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md"
                >
                  #{tag.replace(/^#/, '')}
                </span>
              ))}
            </div>
          )}

          {/* Attached Images */}
          {post.images && post.images.length > 0 && (
            <div className={`grid gap-2 pt-2 ${post.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {post.images.map((img, idx) => (
                <div key={idx} className="rounded-2xl overflow-hidden bg-slate-900 max-h-96">
                  <img
                    src={img}
                    alt="Post media"
                    className="w-full h-full object-cover hover:scale-102 transition-transform cursor-pointer"
                    onClick={() => window.open(img, '_blank')}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Post Actions (Like, Comment, Share) */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 font-semibold transition-colors ${
                liked ? 'text-rose-500 font-bold' : 'hover:text-rose-500 text-slate-600'
              }`}
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500 text-rose-500 animate-bounce-short' : ''}`} />
              <span>{likeCount}</span>
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-1.5 font-semibold text-slate-600 hover:text-blue-600 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{commentCount} Comments</span>
            </button>
          </div>

          <button
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              success('Post link copied to clipboard');
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Share"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Comment Section Toggle */}
        {showComments && (
          <CommentSection
            postId={post._id}
            onCommentCountChange={(count) => setCommentCount(count)}
          />
        )}
      </div>

      {showReportModal && (
        <ReportModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          postId={post._id}
        />
      )}
    </>
  );
};

export default PostCard;
