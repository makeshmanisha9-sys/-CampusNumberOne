import express from 'express';
import {
  getClubs,
  getClubById,
  createClub,
  updateClub,
  deleteClub,
  joinClub,
  leaveClub,
  getMyClubs,
  addClubAnnouncement,
} from '../controllers/clubController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roles.js';

const router = express.Router();

const optionalProtect = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      return protect(req, res, next);
    } catch (e) {
      // Continue
    }
  }
  next();
};

router.get('/', optionalProtect, getClubs);
router.get('/my-clubs', protect, getMyClubs);
router.get('/:id', optionalProtect, getClubById);

router.post('/', protect, authorize('faculty', 'admin'), createClub);
router.put('/:id', protect, authorize('faculty', 'admin'), updateClub);
router.delete('/:id', protect, authorize('admin'), deleteClub);

router.post('/:id/join', protect, joinClub);
router.post('/:id/leave', protect, leaveClub);
router.post('/:id/announcements', protect, addClubAnnouncement);

export default router;
