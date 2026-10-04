import React from 'react';
import { Award, CheckCircle2, AlertTriangle, TrendingUp, BookOpen } from 'lucide-react';

export const AttendanceWidget = ({ attendance, marks, cgpa }) => {
  const overall = attendance?.overall || 91;
  const subjects = attendance?.subjects || [];

  const getHealthColor = (percentage) => {
    if (percentage >= 85) return 'text-emerald-500 bg-emerald-500';
    if (percentage >= 75) return 'text-blue-500 bg-blue-500';
    return 'text-rose-500 bg-rose-500';
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-card space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">Academic Standing & Attendance</h3>
          <p className="text-xs text-slate-500">Semester 6 • Current Academic Session 2026</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl text-xs font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">
            CGPA: {cgpa || 9.15}
          </span>
        </div>
      </div>

      {/* Main Gauge & KPI Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col justify-between">
          <p className="text-xs text-slate-400 font-medium">Overall Attendance</p>
          <div className="my-2">
            <span className="text-3xl font-extrabold text-cyan-400">{overall}%</span>
          </div>
          <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Above 75% Requirement
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
          <p className="text-xs text-slate-500 font-medium">Internal Marks Avg</p>
          <div className="my-2">
            <span className="text-3xl font-extrabold text-slate-800">28.4 <span className="text-xs text-slate-400">/ 30</span></span>
          </div>
          <p className="text-[11px] text-blue-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Top 5% in CS Dept
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
          <p className="text-xs text-slate-500 font-medium">Credits Completed</p>
          <div className="my-2">
            <span className="text-3xl font-extrabold text-slate-800">142 <span className="text-xs text-slate-400">/ 160</span></span>
          </div>
          <p className="text-[11px] text-purple-600 font-semibold flex items-center gap-1">
            <Award className="w-3.5 h-3.5" /> On Track for Graduation
          </p>
        </div>
      </div>

      {/* Subject-Wise Attendance Progress Bars */}
      {subjects.length > 0 && (
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Subject-Wise Attendance Breakdown
          </h4>
          <div className="space-y-3">
            {subjects.map((sub, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-800">
                    {sub.subjectCode} - {sub.subjectName}
                  </span>
                  <span className="text-slate-600">
                    {sub.attended}/{sub.total} Classes ({sub.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      sub.percentage >= 85
                        ? 'bg-emerald-500'
                        : sub.percentage >= 75
                        ? 'bg-blue-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${sub.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceWidget;
