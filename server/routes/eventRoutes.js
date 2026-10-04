import express from 'express';
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  cancelRegistration,
  getMyRegistrations,
} from '../controllers/eventController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roles.js';

const router = express.Router();

// Optional auth helper to attach req.user if token present
const optionalProtect = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      return protect(req, res, next);
    } catch (e) {
      // Continue unauthenticated
    }
  }
  next();
};

router.get('/', optionalProtect, getEvents);
router.get('/my-registrations', protect, getMyRegistrations);
router.get('/:id', optionalProtect, getEventById);

router.post('/', protect, authorize('faculty', 'admin'), createEvent);
router.put('/:id', protect, authorize('faculty', 'admin'), updateEvent);
router.delete('/:id', protect, authorize('faculty', 'admin'), deleteEvent);

router.post('/:id/register', protect, registerForEvent);
router.post('/:id/cancel', protect, cancelRegistration);

export default router;
