import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import StatCard from '../../components/admin/StatCard';
import AnalyticsCharts from '../../components/admin/AnalyticsCharts';
import UserManagementTable from '../../components/admin/UserManagementTable';
import ModerationQueue from '../../components/admin/ModerationQueue';
import Loader from '../../components/common/Loader';
import {
  Shield,
  Users,
  GraduationCap,
  Calendar,
  School,
  MessageSquare,
  Ticket,
  Flag,
  Sparkles,
  ArrowRight,
  PlusCircle,
} from 'lucide-react';

export const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, analyticsRes, usersRes, reportsRes] = await Promise.all([
        adminService.getStats(),
        adminService.getAnalytics(),
        adminService.getUsers({ limit: 10 }),
        adminService.getReports(),
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (analyticsRes.success) setAnalytics(analyticsRes);
      if (usersRes.success) setUsers(usersRes.users || []);
      if (reportsRes.success) setReports(reportsRes.reports || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  if (loading) {
    return <Loader fullPage message="Loading system telemetry & admin console..." />;
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 text-white shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-[11px] font-bold text-purple-300">
            <Shield className="w-3.5 h-3.5" /> Institutional Administration
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Campus Executive Control Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Real-time monitoring across user accounts, campus events, student club charters, announcements, and moderation reports.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/users"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors"
          >
            User Directory
          </Link>
          <Link
            to="/admin/moderation"
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-colors"
          >
            Moderation Queue
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Students"
          value={stats?.totalStudents || 4520}
          change="+14% this term"
          icon={GraduationCap}
          color="cyan"
        />
        <StatCard
          title="Faculty Members"
          value={stats?.totalFaculty || 184}
          change="+4% this term"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Active Events"
          value={stats?.totalEvents || 32}
          change="+28% registrations"
          icon={Calendar}
          color="emerald"
        />
        <StatCard
          title="Student Clubs"
          value={stats?.totalClubs || 18}
          change="98% active rate"
          icon={School}
          color="purple"
        />
      </div>

      {/* Analytics Charts */}
      <AnalyticsCharts
        monthlyData={analytics?.monthlyRegistrations}
        categoryData={analytics?.categoryDistribution}
        clubData={analytics?.clubMembershipsDistribution}
      />

      {/* User Management Table */}
      <UserManagementTable users={users} onUpdate={fetchAdminData} />

      {/* Moderation Queue */}
      <ModerationQueue reports={reports} onUpdate={fetchAdminData} />
    </div>
  );
};

export default AdminDashboard;
