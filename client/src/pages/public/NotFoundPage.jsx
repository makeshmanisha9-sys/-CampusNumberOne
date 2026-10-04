import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center mx-auto border border-cyan-500/30">
          <GraduationCap className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-6xl font-black text-slate-900 tracking-tight">404</h1>
          <h2 className="text-xl font-bold text-slate-800 mt-2">Campus Page Not Found</h2>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            The campus record, course material, or portal URL you requested does not exist or has been moved.
          </p>
        </div>
        <div className="flex justify-center gap-3">
          <Link
            to="/"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md flex items-center gap-1.5 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Campus Home</span>
          </Link>
          <Link
            to="/dashboard"
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-all"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
