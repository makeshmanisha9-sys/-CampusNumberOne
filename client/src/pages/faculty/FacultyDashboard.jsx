import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import eventService from '../../services/eventService';
import announcementService from '../../services/announcementService';
import academicService from '../../services/academicService';
import EventCard from '../../components/events/EventCard';
import EventModal from '../../components/events/EventModal';
import AnnouncementCard from '../../components/announcements/AnnouncementCard';
import AnnouncementModal from '../../components/announcements/AnnouncementModal';
import MaterialCard from '../../components/academics/MaterialCard';
import MaterialUploadModal from '../../components/academics/MaterialUploadModal';
import AssignmentCard from '../../components/academics/AssignmentCard';
import AssignmentModal from '../../components/academics/AssignmentModal';
import Loader from '../../components/common/Loader';
import {
  School,
  Calendar,
  Megaphone,
  BookOpen,
  PlusCircle,
  Users,
  CheckCircle2,
  FileText,
  Sparkles,
} from 'lucide-react';

export const FacultyDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [assignments, setAssignments] = useState([]);

  // Modals
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);
  const [showAnnModal, setShowAnnModal] = useState(false);
  const [annToEdit, setAnnToEdit] = useState(null);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);

  const fetchFacultyData = async () => {
    setLoading(true);
    try {
      const [eventsRes, annRes, matRes, assignRes] = await Promise.all([
        eventService.getEvents({ limit: 4 }),
        announcementService.getAnnouncements({ limit: 3 }),
        academicService.getMaterials({ limit: 4 }),
        academicService.getAssignments({ limit: 4 }),
      ]);

      if (eventsRes.success) setEvents(eventsRes.events || []);
      if (annRes.success) setAnnouncements(annRes.announcements || []);
      if (matRes.success) setMaterials(matRes.materials || []);
      if (assignRes.success) setAssignments(assignRes.assignments || []);
    } catch (err) {
      console.error('Failed to load faculty data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacultyData();
  }, []);

  if (loading) {
    return <Loader fullPage message="Loading faculty portal records..." />;
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 p-6 sm:p-8 text-white shadow-2xl border border-slate-800 overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-[11px] font-bold text-blue-300">
              <School className="w-3.5 h-3.5" /> Faculty Command Center
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome, {user?.name || 'Prof. Sarah Jenkins'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              {user?.department || 'Department of Computer Science & Engineering'} • Office: Academic Block A, Room 402
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setAnnToEdit(null);
                setShowAnnModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-glow flex items-center gap-1.5 transition-all"
            >
              <Megaphone className="w-3.5 h-3.5" />
              <span>Post Announcement</span>
            </button>
            <button
              onClick={() => {
                setEventToEdit(null);
                setShowEventModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-blue-glow flex items-center gap-1.5 transition-all"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Publish Event</span>
            </button>
          </div>
        </div>

        {/* Quick Tools Strip */}
        <div className="mt-6 pt-6 border-t border-slate-800 flex flex-wrap items-center gap-3 text-xs">
          <button
            onClick={() => setShowMaterialModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-slate-700 flex items-center gap-1.5 transition-all"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>Upload Notes / Manual</span>
          </button>
          <button
            onClick={() => setShowAssignmentModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-slate-700 flex items-center gap-1.5 transition-all"
          >
            <FileText className="w-3.5 h-3.5 text-purple-400" />
            <span>Create Assignment</span>
          </button>
        </div>
      </div>

      {/* Course Assignments & Grading Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Active Course Assignments</h3>
            <p className="text-xs text-slate-500">Track due dates and grade student project submissions</p>
          </div>
          <button
            onClick={() => setShowAssignmentModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Assignment</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {assignments.map((assign) => (
            <AssignmentCard key={assign._id} assignment={assign} onUpdate={fetchFacultyData} />
          ))}
        </div>
      </div>

      {/* Course Study Materials Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Study Materials & Notes</h3>
            <p className="text-xs text-slate-500">Uploaded PDFs, syllabi, and lab manuals for students</p>
          </div>
          <button
            onClick={() => setShowMaterialModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Upload Document</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {materials.map((mat) => (
            <MaterialCard key={mat._id} material={mat} onUpdate={fetchFacultyData} />
          ))}
        </div>
      </div>

      {/* Campus Events & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Active Events</h3>
            <button
              onClick={() => {
                setEventToEdit(null);
                setShowEventModal(true);
              }}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create Event</span>
            </button>
          </div>

          <div className="space-y-4">
            {events.slice(0, 2).map((ev) => (
              <EventCard
                key={ev._id}
                event={ev}
                onUpdate={fetchFacultyData}
                onEdit={(item) => {
                  setEventToEdit(item);
                  setShowEventModal(true);
                }}
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Published Announcements</h3>
            <button
              onClick={() => {
                setAnnToEdit(null);
                setShowAnnModal(true);
              }}
              className="text-xs font-bold text-cyan-600 hover:text-cyan-800 flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Broadcast Notice</span>
            </button>
          </div>

          <div className="space-y-3">
            {announcements.map((ann) => (
              <AnnouncementCard
                key={ann._id}
                announcement={ann}
                onUpdate={fetchFacultyData}
                onEdit={(item) => {
                  setAnnToEdit(item);
                  setShowAnnModal(true);
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showEventModal && (
        <EventModal
          isOpen={showEventModal}
          onClose={() => setShowEventModal(false)}
          eventToEdit={eventToEdit}
          onSaved={fetchFacultyData}
        />
      )}

      {showAnnModal && (
        <AnnouncementModal
          isOpen={showAnnModal}
          onClose={() => setShowAnnModal(false)}
          announcementToEdit={annToEdit}
          onSaved={fetchFacultyData}
        />
      )}

      {showMaterialModal && (
        <MaterialUploadModal
          isOpen={showMaterialModal}
          onClose={() => setShowMaterialModal(false)}
          onUploaded={fetchFacultyData}
        />
      )}

      {showAssignmentModal && (
        <AssignmentModal
          isOpen={showAssignmentModal}
          onClose={() => setShowAssignmentModal(false)}
          onCreated={fetchFacultyData}
        />
      )}
    </div>
  );
};

export default FacultyDashboard;
