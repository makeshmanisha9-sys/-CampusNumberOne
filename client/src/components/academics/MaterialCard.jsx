import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import academicService from '../../services/academicService';
import Badge from '../common/Badge';
import {
  FileText,
  Download,
  Trash2,
  BookOpen,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';

export const MaterialCard = ({ material, onUpdate }) => {
  const { user, role } = useAuth();
  const { success, error } = useToast();

  const isUploader = user && (material.uploadedBy?._id === user._id || material.uploadedBy === user._id);
  const canManage = role === 'admin' || (role === 'faculty' && isUploader);

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${material.title}"?`)) return;
    try {
      const res = await academicService.deleteMaterial(material._id);
      if (res.success) {
        success('Study material removed');
        if (onUpdate) onUpdate();
      }
    } catch (err) {
      error('Failed to delete material');
    }
  };

  const handleDownload = () => {
    window.open(material.fileUrl, '_blank');
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-card hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="w-11 h-11 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="cyan" className="text-[10px]">
              {material.materialType || 'Lecture Notes'}
            </Badge>

            {canManage && (
              <button
                onClick={handleDelete}
                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 space-y-1.5">
          <div className="flex items-center gap-2 text-[11px] font-bold text-blue-600">
            <span>{material.subjectCode}</span>
            <span>•</span>
            <span className="text-slate-500 font-medium">Semester {material.semester}</span>
          </div>

          <h3 className="text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {material.title}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {material.description || `Course materials uploaded for ${material.subject}.`}
          </p>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="text-[11px] text-slate-400">
          <p className="font-semibold text-slate-700 truncate max-w-[130px]">
            {material.uploadedBy?.name || 'Prof. Faculty'}
          </p>
          <p>{material.fileSize || '2.4 MB'}</p>
        </div>

        <button
          onClick={handleDownload}
          className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all transform hover:-translate-y-0.5"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download</span>
        </button>
      </div>
    </div>
  );
};

export default MaterialCard;
