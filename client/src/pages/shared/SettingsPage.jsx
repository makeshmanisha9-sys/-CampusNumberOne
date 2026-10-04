import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Shield, Bell, Lock, Key, Globe, Eye, Palette } from 'lucide-react';

export const SettingsPage = () => {
  const { user, role } = useAuth();
  const { success } = useToast();
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [browserNotifs, setBrowserNotifs] = useState(true);
  const [themeDark, setThemeDark] = useState(false);

  const handleSavePreferences = (e) => {
    e.preventDefault();
    success('Platform preferences updated successfully');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Account & System Settings</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your notification alerts, security credentials, and campus display preferences.
        </p>
      </div>

      <form onSubmit={handleSavePreferences} className="space-y-6 text-xs">
        {/* Notifications Preference */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-card space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-4 h-4 text-cyan-600" />
            <span>Notification & Alert Preferences</span>
          </h3>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer">
              <div>
                <p className="font-bold text-slate-800">In-App Live Push Alerts</p>
                <p className="text-[11px] text-slate-400">Receive real-time notifications for upcoming events and assignments</p>
              </div>
              <input
                type="checkbox"
                checked={browserNotifs}
                onChange={(e) => setBrowserNotifs(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer">
              <div>
                <p className="font-bold text-slate-800">Email Digest Notifications</p>
                <p className="text-[11px] text-slate-400">Receive daily summary of high-priority institutional announcements</p>
              </div>
              <input
                type="checkbox"
                checked={emailNotifs}
                onChange={(e) => setEmailNotifs(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
            </label>
          </div>
        </div>

        {/* Security & Authentication */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-card space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600" />
            <span>Security & Session Info</span>
          </h3>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500 font-semibold">Account Role</span>
              <span className="font-bold text-slate-900 uppercase">{role}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-semibold">Session Status</span>
              <span className="font-bold text-emerald-600">Active (JWT Encrypted)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-semibold">Institutional Email</span>
              <span className="font-semibold text-slate-700">{user?.email}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all"
          >
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
