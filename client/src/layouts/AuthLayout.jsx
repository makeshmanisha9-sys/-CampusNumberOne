import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft } from 'lucide-react';
import DemoCredentialsBanner from '../components/common/DemoCredentialsBanner';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white selection:bg-cyan-500 selection:text-white">
      <DemoCredentialsBanner />
      <div className="flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Mesh Gradients */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none translate-y-1/2"></div>

        {/* Home Back Link */}
        <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 mb-6 flex justify-between items-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Campus Home</span>
          </Link>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-400 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-slate-950" />
            </div>
            <span className="text-sm font-extrabold text-white tracking-tight">
              CampusNumberOne
            </span>
          </Link>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
          <div className="glass-navy p-6 sm:p-8 rounded-3xl shadow-2xl border border-slate-800 relative z-10">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
