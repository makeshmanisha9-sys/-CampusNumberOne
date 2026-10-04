import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loader = ({ fullPage = false, message = 'Loading campus records...' }) => {
  if (fullPage) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-cyan-500 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-blue-600"></div>
          </div>
        </div>
        <p className="text-sm font-medium text-slate-500 animate-pulse">{message}</p>
      </div>
    );
  }

  return (
    <div className="py-12 flex flex-col items-center justify-center gap-3">
      <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
      <p className="text-xs font-medium text-slate-500">{message}</p>
    </div>
  );
};

export const CardSkeleton = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 animate-pulse">
          <div className="h-44 bg-slate-200 rounded-xl w-full"></div>
          <div className="h-5 bg-slate-200 rounded w-3/4"></div>
          <div className="h-4 bg-slate-200 rounded w-full"></div>
          <div className="h-4 bg-slate-200 rounded w-2/3"></div>
          <div className="pt-4 flex justify-between items-center border-t border-slate-100">
            <div className="h-8 bg-slate-200 rounded-lg w-24"></div>
            <div className="h-8 bg-slate-200 rounded-lg w-20"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Loader;
