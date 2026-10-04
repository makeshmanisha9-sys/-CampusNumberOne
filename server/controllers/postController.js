import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import Report from '../models/Report.js';
import Notification from '../models/Notification.js';
import { emitToAll, emitToUser } from '../config/socket.js';

// @desc    Get all community posts
// @route   GET /api/posts
// @access  Public
export const getPosts = async (req, res, next) => {
  try {
    const { category, tag, page = 1, limit = 20 } = req.query;
    const query = { status: 'Active' };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (tag) {
      query.tags = tag;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .populate('author', 'name email avatar role department')
      .sort({ isPinned: -1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const postsWithLiked = posts.map(post => {
      const obj = post.toObject();
      obj.isLiked = req.user ? post.likes.some(id => id.toString() === req.user._id.toString()) : false;
      return obj;
    });

    res.json({
      success: true,
      count: posts.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      posts: postsWithLiked,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new community post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res, next) => {
  try {
    const { content, images, category, tags } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Post content cannot be empty' });
    }

    const post = await Post.create({
      author: req.user._id,
      content: content.trim(),
      images: images || [],
      category: category || 'General',
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim().replace(/^#/, '')) : []),
    });

    const populatedPost = await Post.findById(post._id).populate('author', 'name email avatar role department');

    emitToAll('new_post', populatedPost);

    res.status(201).json({
      success: true,
      message: 'Post shared with campus community',
      post: {
        ...populatedPost.toObject(),
        isLiked: false,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (req.user.role !== 'admin' && post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this post' });
    }

    await Comment.deleteMany({ post: post._id });
    await post.deleteOne();

    res.json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle like post
// @route   POST /api/posts/:id/like
// @access  Private
export const toggleLikePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const isLiked = post.likes.some(id => id.toString() === req.user._id.toString());

    if (isLiked) {
      post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
      post.likeCount = Math.max(0, post.likeCount - 1);
    } else {
      post.likes.push(req.user._id);
      post.likeCount += 1;

      // Notify post author if not liking own post
      if (post.author.toString() !== req.user._id.toString()) {
        await Notification.create({
          recipient: post.author,
          sender: req.user._id,
          title: 'Someone liked your post! ❤️',
          message: `${req.user.name} liked your post: "${post.content.substring(0, 40)}..."`,
          type: 'post_like',
          link: '/community',
        });

        emitToUser(post.author.toString(), 'new_notification', {
          title: 'Someone liked your post! ❤️',
          message: `${req.user.name} liked your post`,
        });
      }
    }

    await post.save();

    res.json({
      success: true,
      isLiked: !isLiked,
      likeCount: post.likeCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get comments for post
// @route   GET /api/posts/:id/comments
// @access  Public
export const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ post: req.params.id })
      .populate('author', 'name email avatar role department')
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      count: comments.length,
      comments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to post
// @route   POST /api/posts/:id/comment
// @access  Private
export const addComment = async (req, res, next) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Comment content cannot be empty' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const comment = await Comment.create({
      post: post._id,
      author: req.user._id,
      content: content.trim(),
    });

    post.commentCount += 1;
    await post.save();

    const populated = await Comment.findById(comment._id).populate('author', 'name email avatar role department');

    // Notify post author if not commenting on own post
    if (post.author.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: post.author,
        sender: req.user._id,
        title: 'New comment on your post 💬',
        message: `${req.user.name} commented: "${content.substring(0, 50)}..."`,
        type: 'post_comment',
        link: '/community',
      });
    }

    res.status(201).json({
      success: true,
      message: 'Comment added',
      comment: populated,
      commentCount: post.commentCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete comment
// @route   DELETE /api/posts/comments/:commentId
// @access  Private
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    if (req.user.role !== 'admin' && comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this comment' });
    }

    await Post.findByIdAndUpdate(comment.post, { $inc: { commentCount: -1 } });
    await comment.deleteOne();

    res.json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Report post
// @route   POST /api/posts/:id/report
// @access  Private
export const reportPost = async (req, res, next) => {
  try {
    const { reason, details } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const report = await Report.create({
      reporter: req.user._id,
      reportedItemType: 'Post',
      reportedItemId: post._id,
      reason: reason || 'Inappropriate Content',
      details: details || '',
      status: 'Pending',
    });

    post.isReported = true;
    await post.save();

    res.status(201).json({
      success: true,
      message: 'Post reported to campus moderation team. Thank you for keeping the community safe.',
      report,
    });
  } catch (error) {
    next(error);
  }
};
