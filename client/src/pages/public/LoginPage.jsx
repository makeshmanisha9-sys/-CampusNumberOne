import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Lock,
  Mail,
  ArrowRight,
  GraduationCap,
  Users,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { login, quickDemoLogin } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        success(`Welcome back, ${res.user.name}!`);
        if (from) {
          navigate(from, { replace: true });
        } else if (res.user.role === 'admin') {
          navigate('/admin');
        } else if (res.user.role === 'faculty') {
          navigate('/faculty');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password credentials.';
      setErrorMessage(msg);
      error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (roleType) => {
    setLoading(true);
    try {
      const res = await quickDemoLogin(roleType);
      if (res.success) {
        success(`Logged in as demo ${roleType.toUpperCase()}: ${res.user.name}`);
        if (roleType === 'admin') navigate('/admin');
        else if (roleType === 'faculty') navigate('/faculty');
        else navigate('/dashboard');
      }
    } catch (err) {
      error('Demo login failed. Make sure server is reachable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-extrabold text-white tracking-tight">Sign In to Campus</h2>
        <p className="text-xs text-slate-400">
          Enter your institutional credentials to access your dashboard
        </p>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 1-Click Demo Logins */}
      <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
        <p className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider text-center">
          ⚡ 1-Click Instant Demo Login
        </p>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleDemoLogin('student')}
            className="py-2 px-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-[11px] font-semibold flex flex-col items-center gap-1 transition-all"
          >
            <GraduationCap className="w-4 h-4 text-cyan-400" />
            <span>Student</span>
          </button>
          <button
            type="button"
            onClick={() => handleDemoLogin('faculty')}
            className="py-2 px-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-[11px] font-semibold flex flex-col items-center gap-1 transition-all"
          >
            <Users className="w-4 h-4 text-blue-400" />
            <span>Faculty</span>
          </button>
          <button
            type="button"
            onClick={() => handleDemoLogin('admin')}
            className="py-2 px-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-[11px] font-semibold flex flex-col items-center gap-1 transition-all"
          >
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>Admin</span>
          </button>
        </div>
      </div>

      <div className="relative flex items-center justify-center">
        <div className="border-t border-slate-800 w-full"></div>
        <span className="bg-slate-900 px-3 text-[10px] uppercase font-bold text-slate-500 absolute">
          Or with Email & Password
        </span>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Campus Email</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. student@campus.edu"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-semibold text-slate-300">Password</label>
            <span className="text-[11px] text-cyan-400">Demo password: password123</span>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-cyan-400 hover:from-blue-500 hover:to-cyan-300 text-slate-950 font-extrabold text-xs shadow-glow flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
        >
          <span>{loading ? 'Authenticating...' : 'Sign In To Dashboard'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="text-center text-xs text-slate-400">
        New to CampusNumberOne?{' '}
        <Link to="/register" className="font-bold text-cyan-400 hover:text-cyan-300">
          Create an account
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
