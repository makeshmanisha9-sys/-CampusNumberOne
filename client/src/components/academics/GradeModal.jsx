import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import academicService from '../../services/academicService';
import { useToast } from '../../context/ToastContext';
import { Award, CheckCheck, ExternalLink } from 'lucide-react';

export const GradeModal = ({ isOpen, onClose, assignmentId, assignmentTitle, maxMarks, onGraded }) => {
  const { success, error } = useToast();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);
  const [marks, setMarks] = useState(90);
  const [feedback, setFeedback] = useState('');
  const [grading, setGrading] = useState(false);

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      try {
        const res = await academicService.getAssignmentById(assignmentId);
        if (res.success) {
          setSubmissions(res.submissions || []);
        }
      } catch (err) {
        console.error('Failed to load assignment submissions:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchSubmissions();
    }
  }, [isOpen, assignmentId]);

  const handleGrade = async (e) => {
    e.preventDefault();
    if (!selectedSub) return;

    setGrading(true);
    try {
      const res = await academicService.gradeSubmission(selectedSub._id, {
        marksObtained: Number(marks),
        feedback,
      });

      if (res.success) {
        success(`Submission graded (${marks}/${maxMarks})`);
        setSubmissions((prev) =>
          prev.map((s) => (s._id === selectedSub._id ? res.submission : s))
        );
        setSelectedSub(null);
        if (onGraded) onGraded();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to grade submission');
    } finally {
      setGrading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Submissions: ${assignmentTitle}`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-4 text-xs">
        {loading ? (
          <p className="text-center py-8 text-slate-400">Loading student submissions...</p>
        ) : submissions.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            No students have submitted this assignment yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* List */}
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              <p className="font-bold text-slate-700 mb-2">Submitted Works ({submissions.length})</p>
              {submissions.map((sub) => (
                <div
                  key={sub._id}
                  onClick={() => {
                    setSelectedSub(sub);
                    setMarks(sub.marksObtained || 85);
                    setFeedback(sub.feedback || 'Good effort and thorough documentation.');
                  }}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                    selectedSub?._id === sub._id
                      ? 'bg-blue-50/80 border-blue-400 shadow-sm'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-slate-900">{sub.student?.name || 'Student'}</p>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        sub.status === 'Graded'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {sub.status === 'Graded' ? `${sub.marksObtained}/${maxMarks} Marks` : 'Needs Grading'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 truncate">
                    {sub.submissionText || 'Attached document solution'}
                  </p>
                </div>
              ))}
            </div>

            {/* Grading Form */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              {selectedSub ? (
                <form onSubmit={handleGrade} className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                    <p className="font-bold text-slate-800">
                      Grading: {selectedSub.student?.name}
                    </p>
                    {selectedSub.fileUrl && (
                      <a
                        href={selectedSub.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1 font-bold text-[11px]"
                      >
                        <span>Open File</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Score (Max: {maxMarks})
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={maxMarks}
                      required
                      value={marks}
                      onChange={(e) => setMarks(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Faculty Feedback</label>
                    <textarea
                      rows="3"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Add personalized praise or improvement notes..."
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 resize-none text-xs"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={grading}
                    className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <CheckCheck className="w-4 h-4" />
                    <span>{grading ? 'Submitting Grade...' : 'Save & Post Grade'}</span>
                  </button>
                </form>
              ) : (
                <div className="h-full flex items-center justify-center text-center text-slate-400 p-6">
                  Select a student from the left panel to review files and grade their submission.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default GradeModal;
