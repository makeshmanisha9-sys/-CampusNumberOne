import express from 'express';
import {
  getAchievements,
  getMyAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  toggleLikeAchievement,
} from '../controllers/achievementController.js';
import { protect } from '../middleware/auth.js';

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

router.get('/', optionalProtect, getAchievements);
router.get('/my', protect, getMyAchievements);
router.post('/', protect, createAchievement);
router.put('/:id', protect, updateAchievement);
router.delete('/:id', protect, deleteAchievement);
router.post('/:id/like', protect, toggleLikeAchievement);

export default router;
