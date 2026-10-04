import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import AnalyticsCharts from '../../components/admin/AnalyticsCharts';
import Loader from '../../components/common/Loader';
import { BarChart3, TrendingUp, Users, Award } from 'lucide-react';

export const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await adminService.getAnalytics();
        if (res.success) setAnalytics(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <Loader fullPage message="Aggregating platform KPIs & analytics..." />;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Campus Intelligence & Deep Analytics</h2>
        <p className="text-xs text-slate-500">Telemetry on student registrations, active participation, and department metrics</p>
      </div>

      <AnalyticsCharts
        monthlyData={analytics?.monthlyRegistrations}
        categoryData={analytics?.categoryDistribution}
        clubData={analytics?.clubMembershipsDistribution}
      />

      {/* Department Breakdown Table */}
      {analytics?.departmentStats && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-card space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Department Enrollment & Faculty Ratios</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-100">
                <tr>
                  <th className="px-4 py-2.5">Academic Department</th>
                  <th className="px-4 py-2.5">Enrolled Students</th>
                  <th className="px-4 py-2.5">Active Faculty</th>
                  <th className="px-4 py-2.5">Student-Teacher Ratio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {analytics.departmentStats.map((dept, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-semibold text-slate-800">{dept.department}</td>
                    <td className="px-4 py-3 text-slate-600">{dept.students} Students</td>
                    <td className="px-4 py-3 text-slate-600">{dept.faculty} Professors</td>
                    <td className="px-4 py-3 text-blue-600 font-bold">
                      {(dept.students / dept.faculty).toFixed(1)} : 1
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnalytics;
