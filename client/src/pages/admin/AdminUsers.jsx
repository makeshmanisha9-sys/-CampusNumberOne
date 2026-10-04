import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import UserManagementTable from '../../components/admin/UserManagementTable';
import Loader from '../../components/common/Loader';

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminService.getUsers({ limit: 50 });
      if (res.success) setUsers(res.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <Loader fullPage message="Loading student & faculty records..." />;

  return (
    <div className="space-y-6">
      <UserManagementTable users={users} onUpdate={fetchUsers} />
    </div>
  );
};

export default AdminUsers;
