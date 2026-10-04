import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap,
  Calendar,
  Users,
  Megaphone,
  BookOpen,
  Trophy,
  MessageSquare,
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, role, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (role === 'admin') return '/admin';
    if (role === 'faculty') return '/faculty';
    return '/dashboard';
  };

  return (
    <nav className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-cyan-300 flex items-center justify-center shadow-glow group-hover:scale-105 transition-all">
              <GraduationCap className="w-6 h-6 text-slate-950" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent">
                CampusNumberOne
              </span>
              <span className="text-[9px] uppercase tracking-widest text-cyan-400 font-semibold -mt-1">
                One Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-300">
            <Link
              to="/events"
              className="px-3 py-2 rounded-lg hover:text-white hover:bg-slate-800/80 transition-colors flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>Events</span>
            </Link>
            <Link
              to="/clubs"
              className="px-3 py-2 rounded-lg hover:text-white hover:bg-slate-800/80 transition-colors flex items-center gap-1.5"
            >
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Clubs</span>
            </Link>
            <Link
              to="/announcements"
              className="px-3 py-2 rounded-lg hover:text-white hover:bg-slate-800/80 transition-colors flex items-center gap-1.5"
            >
              <Megaphone className="w-4 h-4 text-cyan-400" />
              <span>Announcements</span>
            </Link>
            <Link
              to="/community"
              className="px-3 py-2 rounded-lg hover:text-white hover:bg-slate-800/80 transition-colors flex items-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span>Community</span>
            </Link>
            <Link
              to="/academics"
              className="px-3 py-2 rounded-lg hover:text-white hover:bg-slate-800/80 transition-colors flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Academics</span>
            </Link>
            <Link
              to="/achievements"
              className="px-3 py-2 rounded-lg hover:text-white hover:bg-slate-800/80 transition-colors flex items-center gap-1.5"
            >
              <Trophy className="w-4 h-4 text-cyan-400" />
              <span>Achievements</span>
            </Link>
            <Link
              to="/about"
              className="px-3 py-2 rounded-lg hover:text-white hover:bg-slate-800/80 transition-colors"
            >
              About
            </Link>
          </div>

          {/* Desktop Right CTA */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to={getDashboardPath()}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-xs shadow-glow flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Go to Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 font-semibold text-xs transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-xs shadow-glow flex items-center gap-1.5 transition-all transform hover:-translate-y-0.5"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900 px-4 pt-3 pb-6 space-y-2">
          <Link
            to="/events"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
          >
            Events
          </Link>
          <Link
            to="/clubs"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
          >
            Clubs
          </Link>
          <Link
            to="/announcements"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
          >
            Announcements
          </Link>
          <Link
            to="/community"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
          >
            Campus Community
          </Link>
          <Link
            to="/academics"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
          >
            Academics
          </Link>
          <Link
            to="/achievements"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
          >
            Achievements
          </Link>
          <Link
            to="/about"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
          >
            About CampusNumberOne
          </Link>

          <div className="pt-4 border-t border-slate-800 space-y-2">
            {isAuthenticated ? (
              <>
                <Link
                  to={getDashboardPath()}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-xs"
                >
                  Dashboard ({role})
                </Link>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="block w-full text-center px-4 py-2 rounded-xl bg-slate-800 text-rose-400 font-semibold text-xs"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-center px-4 py-2.5 rounded-xl bg-slate-800 text-slate-200 font-semibold text-xs"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-center px-4 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
