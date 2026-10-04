import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import postService from '../../services/postService';
import { Send, Trash2, User } from 'lucide-react';

export const CommentSection = ({ postId, onCommentCountChange }) => {
  const { user, role, isAuthenticated } = useAuth();
  const { success, error } = useToast();
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const res = await postService.getComments(postId);
        if (res.success) {
          setComments(res.comments || []);
        }
      } catch (err) {
        console.error('Failed to load comments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (!isAuthenticated) {
      error('Please sign in to join the conversation');
      return;
    }

    setSubmitting(true);
    try {
      const res = await postService.addComment(postId, { content });
      if (res.success) {
        setComments((prev) => [...prev, res.comment]);
        setContent('');
        if (onCommentCountChange) onCommentCountChange(res.commentCount);
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await postService.deleteComment(commentId);
      if (res.success) {
        setComments((prev) => prev.filter((c) => c._id !== commentId));
        if (onCommentCountChange) onCommentCountChange(Math.max(0, comments.length - 1));
      }
    } catch (err) {
      error('Failed to delete comment');
    }
  };

  return (
    <div className="pt-4 mt-4 border-t border-slate-100 space-y-4">
      {/* Existing Comments List */}
      <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
        {loading ? (
          <p className="text-xs text-slate-400 text-center py-2">Loading discussion...</p>
        ) : comments.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-2">No comments yet. Be the first to reply!</p>
        ) : (
          comments.map((comment) => {
            const isCommentAuthor = user && (comment.author?._id === user._id || comment.author === user._id);
            const canDelete = isCommentAuthor || role === 'admin';

            return (
              <div key={comment._id} className="flex items-start gap-2.5 group">
                <img
                  src={comment.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.author?.name || 'User'}`}
                  alt={comment.author?.name}
                  className="w-7 h-7 rounded-xl object-cover bg-slate-100 shrink-0 mt-0.5"
                />
                <div className="flex-1 bg-slate-50 rounded-2xl p-3 border border-slate-100 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{comment.author?.name}</span>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span>{new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {canDelete && (
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="opacity-0 group-hover:opacity-100 text-rose-500 hover:text-rose-700 transition-opacity"
                          title="Delete comment"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-slate-600 mt-1 leading-relaxed">{comment.content}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Comment Input */}
      {isAuthenticated && (
        <form onSubmit={handleAddComment} className="flex items-center gap-2">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a supportive reply..."
            className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
          />
          <button
            type="submit"
            disabled={submitting || !content.trim()}
            className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      )}
    </div>
  );
};

export default CommentSection;
