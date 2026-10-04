import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Sparkles, Shield, GraduationCap, School } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DemoCredentialsBanner = () => {
  const { quickDemoLogin, role, isAuthenticated } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const handleDemoSwitch = async (roleType) => {
    try {
      const res = await quickDemoLogin(roleType);
      if (res.success) {
        success(`Logged in as demo ${roleType.toUpperCase()}: ${res.user.name}`);
        if (roleType === 'admin') navigate('/admin');
        else if (roleType === 'faculty') navigate('/faculty');
        else navigate('/dashboard');
      }
    } catch (err) {
      error('Failed to log in with demo account. Ensure server is running.');
    }
  };

  return (
    <div className="bg-slate-900 text-white border-b border-slate-800 text-xs py-2 px-4">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="font-semibold text-white">Interactive Demo Switcher:</span>
          <span className="hidden md:inline text-slate-400">Explore full functionality across different campus roles with 1 click</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDemoSwitch('student')}
            className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              isAuthenticated && role === 'student'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-glow'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Student</span>
          </button>

          <button
            onClick={() => handleDemoSwitch('faculty')}
            className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              isAuthenticated && role === 'faculty'
                ? 'bg-blue-500 text-white font-bold shadow-blue-glow'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            <School className="w-3.5 h-3.5" />
            <span>Faculty</span>
          </button>

          <button
            onClick={() => handleDemoSwitch('admin')}
            className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              isAuthenticated && role === 'admin'
                ? 'bg-purple-500 text-white font-bold'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemoCredentialsBanner;
