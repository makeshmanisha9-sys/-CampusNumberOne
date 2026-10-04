import React, { useState } from 'react';
import Modal from '../common/Modal';
import academicService from '../../services/academicService';
import { useToast } from '../../context/ToastContext';
import { UploadCloud } from 'lucide-react';

export const MaterialUploadModal = ({ isOpen, onClose, onUploaded }) => {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: 'Distributed Systems',
    subjectCode: 'CS601',
    semester: 6,
    materialType: 'Lecture Notes',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileName: 'Course_Material_Notes.pdf',
    fileSize: '3.2 MB',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await academicService.uploadMaterial(formData);
      if (res.success) {
        success('Study material published to students');
        onUploaded();
        onClose();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to upload material');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Academic Study Material" maxWidth="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Material Document Title</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. CS601 Unit 3 - Consensus Algorithms & Raft"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Subject Name</label>
            <input
              type="text"
              required
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="Distributed Systems"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Subject Code</label>
            <input
              type="text"
              required
              value={formData.subjectCode}
              onChange={(e) => setFormData({ ...formData, subjectCode: e.target.value })}
              placeholder="CS601"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Material Type</label>
            <select
              value={formData.materialType}
              onChange={(e) => setFormData({ ...formData, materialType: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 bg-white"
            >
              <option value="Lecture Notes">Lecture Notes</option>
              <option value="Lab Manual">Lab Manual</option>
              <option value="Syllabus">Syllabus</option>
              <option value="Question Bank">Question Bank</option>
              <option value="Reference Book">Reference Book</option>
              <option value="Presentation">Presentation / Slides</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Semester</label>
            <select
              value={formData.semester}
              onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 bg-white"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={s}>Semester {s}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">File URL / Download Link</label>
          <input
            type="url"
            required
            value={formData.fileUrl}
            onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
            placeholder="https://..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Description (Optional)</label>
          <textarea
            rows="2"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Key topics covered in this resource..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 resize-none"
          ></textarea>
        </div>

        <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20 flex items-center gap-1.5"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{loading ? 'Uploading...' : 'Publish Material'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default MaterialUploadModal;
