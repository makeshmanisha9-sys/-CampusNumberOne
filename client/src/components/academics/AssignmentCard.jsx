import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import SubmissionModal from './SubmissionModal';
import GradeModal from './GradeModal';
import Badge from '../common/Badge';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Send,
  Award,
  Layers,
} from 'lucide-react';

export const AssignmentCard = ({ assignment, onUpdate }) => {
  const { user, role } = useAuth();
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);

  const mySubmission = assignment.mySubmission;
  const isPastDue = new Date() > new Date(assignment.dueDate);

  const getStatusBadge = () => {
    if (role === 'faculty' || role === 'admin') {
      return (
        <Badge variant={isPastDue ? 'neutral' : 'primary'}>
          {isPastDue ? 'Past Due' : 'Active Assignment'}
        </Badge>
      );
    }

    if (mySubmission) {
      if (mySubmission.status === 'Graded') {
        return (
          <Badge variant="success" dot>
            Graded: {mySubmission.marksObtained}/{assignment.maxMarks}
          </Badge>
        );
      }
      return (
        <Badge variant="cyan" dot>
          Submitted ({mySubmission.status})
        </Badge>
      );
    }

    return (
      <Badge variant={isPastDue ? 'danger' : 'warning'} dot>
        {isPastDue ? 'Overdue' : 'Pending Submission'}
      </Badge>
    );
  };

  return (
    <>
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-card hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-xl">
                {assignment.subjectCode}
              </span>
              <span className="text-xs font-semibold text-slate-700">{assignment.subject}</span>
            </div>
            {getStatusBadge()}
          </div>

          <div className="mt-3 space-y-2">
            <h3 className="text-base font-bold text-slate-900 leading-snug">{assignment.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
              {assignment.description}
            </p>
          </div>
        </div>

        {/* Due Date & Marks Info */}
        <div className="pt-3 border-t border-slate-100 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <div className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-rose-500" />
              <span>Due: {new Date(assignment.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="flex items-center gap-1 font-bold text-slate-700">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>Max: {assignment.maxMarks} Marks</span>
            </div>
          </div>

          {/* Feedback section if graded */}
          {mySubmission?.feedback && (
            <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs">
              <p className="font-bold text-emerald-900">Faculty Feedback:</p>
              <p className="text-emerald-700 mt-0.5">{mySubmission.feedback}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <p className="text-[11px] text-slate-400">
              Assigned by: {assignment.createdBy?.name || 'Course Instructor'}
            </p>

            {role === 'student' ? (
              <button
                onClick={() => setShowSubmitModal(true)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  mySubmission
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20'
                }`}
              >
                {mySubmission ? 'View / Resubmit' : 'Turn In Assignment'}
              </button>
            ) : (
              <button
                onClick={() => setShowGradeModal(true)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-500/20"
              >
                Submissions Portal
              </button>
            )}
          </div>
        </div>
      </div>

      {showSubmitModal && (
        <SubmissionModal
          isOpen={showSubmitModal}
          onClose={() => setShowSubmitModal(false)}
          assignment={assignment}
          mySubmission={mySubmission}
          onSubmitted={() => {
            if (onUpdate) onUpdate();
          }}
        />
      )}

      {showGradeModal && (
        <GradeModal
          isOpen={showGradeModal}
          onClose={() => setShowGradeModal(false)}
          assignmentId={assignment._id}
          assignmentTitle={assignment.title}
          maxMarks={assignment.maxMarks}
          onGraded={() => {
            if (onUpdate) onUpdate();
          }}
        />
      )}
    </>
  );
};

export default AssignmentCard;
