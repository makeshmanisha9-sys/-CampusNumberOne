import express from 'express';
import {
  getDashboardStats,
  getAnalyticsData,
  getReports,
  resolveReport,
} from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roles.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/analytics', getAnalyticsData);
router.get('/reports', getReports);
router.put('/reports/:id/resolve', resolveReport);

export default router;
