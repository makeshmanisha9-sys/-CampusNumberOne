import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import AuthLayout from '../layouts/AuthLayout';
import ProtectedRoute from './ProtectedRoute';

// Public Pages
import LandingPage from '../pages/public/LandingPage';
import AboutPage from '../pages/public/AboutPage';
import ContactPage from '../pages/public/ContactPage';
import LoginPage from '../pages/public/LoginPage';
import RegisterPage from '../pages/public/RegisterPage';
import NotFoundPage from '../pages/public/NotFoundPage';

// Dashboards
import StudentDashboard from '../pages/student/StudentDashboard';
import FacultyDashboard from '../pages/faculty/FacultyDashboard';
import AdminDashboard from '../pages/admin/AdminDashboard';

// Admin Sub-pages
import AdminUsers from '../pages/admin/AdminUsers';
import AdminEvents from '../pages/admin/AdminEvents';
import AdminClubs from '../pages/admin/AdminClubs';
import AdminAnnouncements from '../pages/admin/AdminAnnouncements';
import AdminModeration from '../pages/admin/AdminModeration';
import AdminAnalytics from '../pages/admin/AdminAnalytics';

// Shared Pages
import EventsPage from '../pages/shared/EventsPage';
import EventDetailPage from '../pages/shared/EventDetailPage';
import ClubsPage from '../pages/shared/ClubsPage';
import ClubDetailPage from '../pages/shared/ClubDetailPage';
import AnnouncementsPage from '../pages/shared/AnnouncementsPage';
import CommunityPage from '../pages/shared/CommunityPage';
import AcademicsPage from '../pages/shared/AcademicsPage';
import AchievementsPage from '../pages/shared/AchievementsPage';
import NotificationsPage from '../pages/shared/NotificationsPage';
import ProfilePage from '../pages/shared/ProfilePage';
import SettingsPage from '../pages/shared/SettingsPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      {/* Auth Pages */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Authenticated Dashboard & Modules */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Student Portal */}
        <Route path="/dashboard" element={<StudentDashboard />} />

        {/* Faculty Portal */}
        <Route
          path="/faculty"
          element={
            <ProtectedRoute allowedRoles={['faculty', 'admin']}>
              <FacultyDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Console & Sub-pages */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/events"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminEvents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/clubs"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminClubs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/announcements"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminAnnouncements />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/moderation"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminModeration />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminAnalytics />
            </ProtectedRoute>
          }
        />

        {/* Shared Modules */}
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route path="/clubs" element={<ClubsPage />} />
        <Route path="/clubs/:id" element={<ClubDetailPage />} />
        <Route path="/announcements" element={<AnnouncementsPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/academics" element={<AcademicsPage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* 404 Fallback */}
      <Route element={<MainLayout />}>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
