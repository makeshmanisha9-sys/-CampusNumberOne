import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import academicService from '../../services/academicService';
import MaterialCard from '../../components/academics/MaterialCard';
import MaterialUploadModal from '../../components/academics/MaterialUploadModal';
import AssignmentCard from '../../components/academics/AssignmentCard';
import AssignmentModal from '../../components/academics/AssignmentModal';
import AttendanceWidget from '../../components/academics/AttendanceWidget';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import {
  BookOpen,
  FileText,
  Award,
  PlusCircle,
  Search,
  Filter,
  Layers,
} from 'lucide-react';

export const AcademicsPage = () => {
  const { user, role } = useAuth();
  const [activeTab, setActiveTab] = useState('materials'); // 'materials' | 'assignments' | 'attendance'
  const [materials, setMaterials] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [academicOverview, setAcademicOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('All');

  // Modals
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [matRes, assignRes, overRes] = await Promise.all([
        academicService.getMaterials({
          search,
          semester: selectedSemester === 'All' ? undefined : selectedSemester,
        }),
        academicService.getAssignments({
          semester: selectedSemester === 'All' ? undefined : selectedSemester,
        }),
        academicService.getStudentOverview(),
      ]);

      if (matRes.success) setMaterials(matRes.materials || []);
      if (assignRes.success) setAssignments(assignRes.assignments || []);
      if (overRes.success) setAcademicOverview(overRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedSemester]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  const canAuthor = role === 'faculty' || role === 'admin';

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Academics & Course Repository</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Access lecture slides, syllabi, question banks, course assignments, and attendance records.
          </p>
        </div>

        {canAuthor && (
          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => setShowMaterialModal(true)}
              className="px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Upload Notes</span>
            </button>
            <button
              onClick={() => setShowAssignmentModal(true)}
              className="px-4 py-2 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 flex items-center gap-1.5 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Assignment</span>
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('materials')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'materials'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Study Materials ({materials.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('assignments')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'assignments'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Assignments ({assignments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('attendance')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'attendance'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Attendance & Marks</span>
        </button>
      </div>

      {/* Content based on Active Tab */}
      {activeTab === 'materials' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <form onSubmit={handleSearchSubmit} className="relative max-w-sm w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search subject or notes title..."
                className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
              />
            </form>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-semibold">Semester:</span>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold focus:outline-none"
              >
                <option value="All">All Semesters</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <Loader message="Loading course study materials..." />
          ) : materials.length === 0 ? (
            <EmptyState
              icon="folder"
              title="No materials found"
              message="No lecture notes matching your search criteria."
              actionText={canAuthor ? 'Upload First Note' : 'Reset Search'}
              onAction={() => {
                if (canAuthor) setShowMaterialModal(true);
                else setSearch('');
              }}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {materials.map((mat) => (
                <MaterialCard key={mat._id} material={mat} onUpdate={fetchData} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'assignments' && (
        <div className="space-y-6">
          {loading ? (
            <Loader message="Loading class assignments..." />
          ) : assignments.length === 0 ? (
            <EmptyState
              icon="calendar"
              title="No active assignments"
              message="There are no assignments currently pending submission."
              actionText={canAuthor ? 'Create Assignment' : null}
              onAction={() => setShowAssignmentModal(true)}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {assignments.map((assign) => (
                <AssignmentCard key={assign._id} assignment={assign} onUpdate={fetchData} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <AttendanceWidget
            attendance={academicOverview?.attendance}
            marks={academicOverview?.marks}
            cgpa={academicOverview?.cgpa}
          />
        </div>
      )}

      {/* Modals */}
      {showMaterialModal && (
        <MaterialUploadModal
          isOpen={showMaterialModal}
          onClose={() => setShowMaterialModal(false)}
          onUploaded={fetchData}
        />
      )}

      {showAssignmentModal && (
        <AssignmentModal
          isOpen={showAssignmentModal}
          onClose={() => setShowAssignmentModal(false)}
          onCreated={fetchData}
        />
      )}
    </div>
  );
};

export default AcademicsPage;
