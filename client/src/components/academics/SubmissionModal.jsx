import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import academicService from '../../services/academicService';
import { useToast } from '../../context/ToastContext';
import { UploadCloud, CheckCircle2, Clock } from 'lucide-react';

export const SubmissionModal = ({ isOpen, onClose, assignment, mySubmission, onSubmitted }) => {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    submissionText: '',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileName: '',
  });

  useEffect(() => {
    if (mySubmission) {
      setFormData({
        submissionText: mySubmission.submissionText || '',
        fileUrl: mySubmission.fileUrl || '',
        fileName: mySubmission.fileName || '',
      });
    }
  }, [mySubmission, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await academicService.submitAssignment(assignment._id, formData);
      if (res.success) {
        success('Assignment turned in successfully!');
        onSubmitted();
        onClose();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to submit assignment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Submit Assignment: ${assignment.title}`} maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 text-slate-700 space-y-1">
          <div className="flex justify-between font-bold">
            <span>{assignment.subjectCode}: {assignment.subject}</span>
            <span>Max Marks: {assignment.maxMarks}</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Due on: {new Date(assignment.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Work / Repository / Project URL</label>
          <input
            type="url"
            required
            value={formData.fileUrl}
            onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
            placeholder="https://github.com/... or Google Drive / PDF link"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">File or Attachment Name</label>
          <input
            type="text"
            value={formData.fileName}
            onChange={(e) => setFormData({ ...formData, fileName: e.target.value })}
            placeholder="e.g. AlexRivera_Assignment1_Solution.pdf"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Comments / Solution Summary</label>
          <textarea
            rows="3"
            value={formData.submissionText}
            onChange={(e) => setFormData({ ...formData, submissionText: e.target.value })}
            placeholder="Summarize your methodology, test outputs, or notes for the faculty..."
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
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20 flex items-center gap-1.5"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{loading ? 'Submitting...' : mySubmission ? 'Update Submission' : 'Turn In'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default SubmissionModal;
