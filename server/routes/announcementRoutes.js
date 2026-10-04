import express from 'express';
import {
  getAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from '../controllers/announcementController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roles.js';

const router = express.Router();

router.get('/', getAnnouncements);
router.get('/:id', getAnnouncementById);

router.post('/', protect, authorize('faculty', 'admin'), createAnnouncement);
router.put('/:id', protect, authorize('faculty', 'admin'), updateAnnouncement);
router.delete('/:id', protect, authorize('faculty', 'admin'), deleteAnnouncement);

export default router;
