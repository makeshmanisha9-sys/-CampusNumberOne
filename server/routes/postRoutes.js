import express from 'express';
import {
  getPosts,
  createPost,
  deletePost,
  toggleLikePost,
  getComments,
  addComment,
  deleteComment,
  reportPost,
} from '../controllers/postController.js';
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

router.get('/', optionalProtect, getPosts);
router.post('/', protect, createPost);
router.delete('/:id', protect, deletePost);
router.post('/:id/like', protect, toggleLikePost);

router.get('/:id/comments', getComments);
router.post('/:id/comment', protect, addComment);
router.delete('/comments/:commentId', protect, deleteComment);

router.post('/:id/report', protect, reportPost);

export default router;
