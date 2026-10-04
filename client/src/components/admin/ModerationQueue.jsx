import React from 'react';
import { useToast } from '../../context/ToastContext';
import adminService from '../../services/adminService';
import Badge from '../common/Badge';
import { Flag, CheckCheck, Trash2, AlertCircle } from 'lucide-react';

export const ModerationQueue = ({ reports = [], onUpdate }) => {
  const { success, error } = useToast();

  const handleResolve = async (reportId, actionTaken, status = 'Resolved') => {
    try {
      const res = await adminService.resolveReport(reportId, { status, actionTaken });
      if (res.success) {
        success(`Report marked as ${status} (${actionTaken})`);
        if (onUpdate) onUpdate();
      }
    } catch (err) {
      error('Failed to update report');
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900">Campus Moderation Queue</h3>
          <p className="text-xs text-slate-500">Student flagged items requiring administrator review</p>
        </div>
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600">
          {reports.filter((r) => r.status === 'Pending').length} Pending Flags
        </span>
      </div>

      {reports.length === 0 ? (
        <div className="text-center py-8 text-xs text-slate-400">
          🎉 All moderation queues are clear. No pending community flags!
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => (
            <div
              key={report._id}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="danger">{report.reason}</Badge>
                  <span className="text-[11px] text-slate-400">
                    Reported by {report.reporter?.name || 'Student'} • {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="font-semibold text-slate-800">
                  Target: {report.reportedItemType} (ID: {report.reportedItemId})
                </p>
                {report.details && (
                  <p className="text-slate-500 text-[11px] italic">"{report.details}"</p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {report.status === 'Pending' ? (
                  <>
                    <button
                      onClick={() => handleResolve(report._id, 'Dismissed without penalty', 'Dismissed')}
                      className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold"
                    >
                      Dismiss
                    </button>
                    <button
                      onClick={() => handleResolve(report._id, 'Delete Post', 'Resolved')}
                      className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center gap-1 shadow-sm"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Content</span>
                    </button>
                  </>
                ) : (
                  <span className="px-3 py-1 rounded-xl bg-slate-200 text-slate-600 font-semibold">
                    {report.status}: {report.actionTaken}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModerationQueue;
