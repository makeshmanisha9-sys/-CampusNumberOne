import React, { useState } from 'react';
import Modal from '../common/Modal';
import postService from '../../services/postService';
import { useToast } from '../../context/ToastContext';
import { Flag, AlertTriangle } from 'lucide-react';

export const ReportModal = ({ isOpen, onClose, postId }) => {
  const { success, error } = useToast();
  const [reason, setReason] = useState('Inappropriate Content');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await postService.reportPost(postId, { reason, details });
      if (res.success) {
        success('Post reported to campus moderators. Thank you for keeping our community safe.');
        onClose();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Report Post to Moderation" maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
          <p className="text-[11px] leading-relaxed">
            CampusNumberOne is committed to safe and constructive community discussions. Reports are actively reviewed by campus administrators.
          </p>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Reason for Flagging</label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 bg-white"
          >
            <option value="Inappropriate Content">Inappropriate or Offensive Content</option>
            <option value="Spam">Spam or Irrelevant Ads</option>
            <option value="Harassment">Harassment or Hate Speech</option>
            <option value="Misinformation">Misinformation / False Announcements</option>
            <option value="Plagiarism">Plagiarism / Unauthorized Copying</option>
            <option value="Other">Other Policy Violation</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Additional Context (Optional)</label>
          <textarea
            rows="3"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Help moderators understand what is wrong with this post..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 resize-none"
          ></textarea>
        </div>

        <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md shadow-rose-500/20 flex items-center gap-1.5"
          >
            <Flag className="w-3.5 h-3.5" />
            <span>{loading ? 'Submitting...' : 'Submit Report'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ReportModal;
