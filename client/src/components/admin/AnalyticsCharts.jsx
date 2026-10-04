import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export const AnalyticsCharts = ({ monthlyData, categoryData, clubData }) => {
  const defaultMonthly = [
    { month: 'May', registrations: 85, students: 34, posts: 52 },
    { month: 'Jun', registrations: 120, students: 48, posts: 78 },
    { month: 'Jul', registrations: 190, students: 65, posts: 110 },
    { month: 'Aug', registrations: 240, students: 90, posts: 165 },
    { month: 'Sep', registrations: 310, students: 124, posts: 230 },
    { month: 'Oct', registrations: 380, students: 145, posts: 290 },
  ];

  const defaultCategory = [
    { name: 'Technical', count: 42, color: '#3B82F6' },
    { name: 'Cultural', count: 28, color: '#EC4899' },
    { name: 'Sports', count: 18, color: '#10B981' },
    { name: 'Workshops', count: 24, color: '#F59E0B' },
    { name: 'Hackathons', count: 15, color: '#8B5CF6' },
  ];

  const defaultClubs = [
    { name: 'Coding Club', members: 245 },
    { name: 'AI Society', members: 180 },
    { name: 'E-Cell', members: 155 },
    { name: 'Robotics', members: 135 },
    { name: 'Photography', members: 120 },
    { name: 'Literary', members: 95 },
  ];

  const trendData = monthlyData || defaultMonthly;
  const pieData = categoryData || defaultCategory;
  const barData = clubData || defaultClubs;

  return (
    <div className="space-y-8">
      {/* 2-Column Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Trend Area Chart */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Monthly Campus Engagement & Growth</h3>
              <p className="text-xs text-slate-500">Registrations, new student signups & community posts</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 font-bold text-[10px]">
              6-Month Trend
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorPost" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '11px',
                    border: 'none',
                  }}
                />
                <Area type="monotone" dataKey="registrations" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorReg)" name="Event Registrations" />
                <Area type="monotone" dataKey="posts" stroke="#06B6D4" strokeWidth={2} fillOpacity={1} fill="url(#colorPost)" name="Community Posts" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Club Membership Bar Chart */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Club Memberships Distribution</h3>
              <p className="text-xs text-slate-500">Active student enrollments across student societies</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-cyan-50 text-cyan-600 font-bold text-[10px]">
              Live Counts
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '11px',
                    border: 'none',
                  }}
                />
                <Bar dataKey="members" fill="#3B82F6" radius={[8, 8, 0, 0]} name="Active Members" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;
