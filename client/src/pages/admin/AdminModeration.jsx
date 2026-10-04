import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import ModerationQueue from '../../components/admin/ModerationQueue';
import Loader from '../../components/common/Loader';

export const AdminModeration = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await adminService.getReports();
      if (res.success) setReports(res.reports || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (loading) return <Loader fullPage message="Loading moderation flags..." />;

  return (
    <div className="space-y-6">
      <ModerationQueue reports={reports} onUpdate={fetchReports} />
    </div>
  );
};

export default AdminModeration;
