import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import DemoCredentialsBanner from '../components/common/DemoCredentialsBanner';

const pageTitles = {
  '/dashboard': 'Student Dashboard',
  '/faculty': 'Faculty Command Center',
  '/admin': 'Admin System Control',
  '/admin/users': 'User Management & Directory',
  '/admin/events': 'Events & Workshop Management',
  '/admin/clubs': 'Student Clubs & Societies Administration',
  '/admin/announcements': 'Announcements & Broadcasts',
  '/admin/moderation': 'Content Moderation & Reports',
  '/admin/analytics': 'Platform Analytics & KPIs',
  '/events': 'Campus Events & Hackathons',
  '/clubs': 'Clubs & Student Societies',
  '/announcements': 'Official Campus Announcements',
  '/community': 'Campus Community Feed',
  '/academics': 'Academics & Study Repository',
  '/achievements': 'Student Portfolio & Achievements',
  '/notifications': 'Notification Center',
  '/profile': 'My Campus Profile',
  '/settings': 'Account & Preference Settings',
};

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const title = pageTitles[location.pathname] || 'Campus Portal';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DemoCredentialsBanner />
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
          <Header onMenuClick={() => setSidebarOpen(true)} title={title} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
