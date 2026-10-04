import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import {
  GraduationCap,
  LayoutDashboard,
  Calendar,
  Users,
  Megaphone,
  MessageSquare,
  BookOpen,
  Trophy,
  Bell,
  User,
  Settings,
  Shield,
  BarChart3,
  Flag,
  LogOut,
  ChevronRight,
  School,
} from 'lucide-react';

export const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, role, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const studentLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Events', path: '/events', icon: Calendar },
    { name: 'Clubs', path: '/clubs', icon: Users },
    { name: 'Announcements', path: '/announcements', icon: Megaphone },
    { name: 'Community', path: '/community', icon: MessageSquare },
    { name: 'Academics', path: '/academics', icon: BookOpen },
    { name: 'Achievements', path: '/achievements', icon: Trophy },
    { name: 'Notifications', path: '/notifications', icon: Bell, badge: unreadCount },
    { name: 'My Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const facultyLinks = [
    { name: 'Faculty Portal', path: '/faculty', icon: School },
    { name: 'Events', path: '/events', icon: Calendar },
    { name: 'Clubs', path: '/clubs', icon: Users },
    { name: 'Announcements', path: '/announcements', icon: Megaphone },
    { name: 'Academics & Notes', path: '/academics', icon: BookOpen },
    { name: 'Community Feed', path: '/community', icon: MessageSquare },
    { name: 'Notifications', path: '/notifications', icon: Bell, badge: unreadCount },
    { name: 'Faculty Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const adminLinks = [
    { name: 'Admin Dashboard', path: '/admin', icon: Shield },
    { name: 'Users Management', path: '/admin/users', icon: Users },
    { name: 'Events Manager', path: '/admin/events', icon: Calendar },
    { name: 'Clubs Manager', path: '/admin/clubs', icon: School },
    { name: 'Announcements', path: '/admin/announcements', icon: Megaphone },
    { name: 'Moderation Queue', path: '/admin/moderation', icon: Flag },
    { name: 'Analytics & Insights', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Community Feed', path: '/community', icon: MessageSquare },
    { name: 'Notifications', path: '/notifications', icon: Bell, badge: unreadCount },
    { name: 'System Settings', path: '/settings', icon: Settings },
  ];

  const links = role === 'admin' ? adminLinks : role === 'faculty' ? facultyLinks : studentLinks;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800 shrink-0">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-cyan-300 flex items-center justify-center shadow-glow">
              <GraduationCap className="w-5 h-5 text-slate-950" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold text-white tracking-tight">
                CampusNumberOne
              </span>
              <span className="text-[9px] uppercase tracking-widest text-cyan-400 font-semibold -mt-0.5">
                {role ? `${role.toUpperCase()} PORTAL` : 'DIGITAL CAMPUS'}
              </span>
            </div>
          </Link>
        </div>

        {/* User Mini Profile Card */}
        <div className="p-4 mx-3 my-3 rounded-xl bg-slate-800/60 border border-slate-800 flex items-center gap-3">
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`}
            alt={user?.name || 'User'}
            className="w-10 h-10 rounded-xl object-cover bg-slate-700 border border-slate-600 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">{user?.name || 'Campus Member'}</p>
            <p className="text-[10px] text-cyan-400 font-medium capitalize truncate">
              {user?.department?.split('&')[0] || user?.role}
            </p>
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === '/dashboard' || item.path === '/faculty' || item.path === '/admin'}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-blue-glow'
                      : 'hover:bg-slate-800/80 hover:text-white text-slate-400'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive ? 'text-white' : 'text-slate-400 group-hover:text-cyan-400'
                        }`}
                      />
                      <span>{item.name}</span>
                    </div>
                    {item.badge > 0 ? (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-400 text-slate-950 animate-pulse">
                        {item.badge}
                      </span>
                    ) : (
                      isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-200" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Footer Logout Action */}
        <div className="p-3 border-t border-slate-800 shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
