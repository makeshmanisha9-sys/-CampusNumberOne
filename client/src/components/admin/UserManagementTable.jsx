import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import adminService from '../../services/adminService';
import Badge from '../common/Badge';
import {
  Search,
  Trash2,
  ShieldCheck,
  GraduationCap,
  Users,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Filter,
} from 'lucide-react';

export const UserManagementTable = ({ users = [], onUpdate }) => {
  const { success, error } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.department?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'All' || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const handleToggleStatus = async (user) => {
    try {
      const res = await adminService.updateUserStatus(user._id, {
        isActive: !user.isActive,
      });
      if (res.success) {
        success(`User status updated to ${!user.isActive ? 'Active' : 'Inactive'}`);
        if (onUpdate) onUpdate();
      }
    } catch (err) {
      error('Failed to update user status');
    }
  };

  const handleDelete = async (userId, name) => {
    if (!window.confirm(`Permanently remove ${name} from CampusNumberOne database?`)) return;
    try {
      const res = await adminService.deleteUser(userId);
      if (res.success) {
        success(`User ${name} removed`);
        if (onUpdate) onUpdate();
      }
    } catch (err) {
      error('Failed to delete user');
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card overflow-hidden space-y-4">
      {/* Table Filters Header */}
      <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-slate-900">User Directory</h3>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            {filteredUsers.length} Users
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email..."
              className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none"
          >
            <option value="All">All Roles</option>
            <option value="student">Students</option>
            <option value="faculty">Faculty</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
            <tr>
              <th className="px-6 py-3">Member</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Department</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-slate-400">
                  No users found matching query
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name || 'User'}`}
                        alt={u.name}
                        className="w-8 h-8 rounded-xl object-cover bg-slate-100 shrink-0"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{u.name}</p>
                        <p className="text-[11px] text-slate-400">{u.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-3.5">
                    <Badge
                      variant={u.role === 'admin' ? 'purple' : u.role === 'faculty' ? 'primary' : 'cyan'}
                    >
                      {u.role?.toUpperCase()}
                    </Badge>
                  </td>

                  <td className="px-6 py-3.5 text-slate-600 font-medium">
                    {u.department}
                  </td>

                  <td className="px-6 py-3.5">
                    <button
                      onClick={() => handleToggleStatus(u)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                        u.isActive !== false
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                          : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                      }`}
                    >
                      {u.isActive !== false ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      <span>{u.isActive !== false ? 'Active' : 'Suspended'}</span>
                    </button>
                  </td>

                  <td className="px-6 py-3.5 text-right">
                    <button
                      onClick={() => handleDelete(u._id, u.name)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete User"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagementTable;
