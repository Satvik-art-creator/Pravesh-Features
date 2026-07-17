const express = require('express');
const fs = require('fs');
const { protect } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');
const Post = require('../models/Post');
const Classroom = require('../models/Classroom');

const router = express.Router();

// ─── Helpers ─────────────────────────────────────────────────────────────────

const resolveOwned = async (req, res) => {
  const classroom = await Classroom.findById(req.params.id);
  if (!classroom) {
    res.status(404).json({ success: false, message: 'Classroom not found' });
    return null;
  }
  if (classroom.teacher.toString() !== req.teacher.id) {
    res.status(403).json({ success: false, message: 'Not authorized to access this classroom' });
    return null;
  }
  return classroom;
};

// ─── Protected routes ─────────────────────────────────────────────────────────

router.use(protect);

/**
 * @desc    Create a post (text and/or file)
 * @route   POST /api/classroom/:id/posts
 */
router.post('/:id/posts', (req, res, next) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      const message =
        err.code === 'LIMIT_FILE_SIZE'
          ? 'File too large — maximum allowed size is 20 MB'
          : err.message || 'File upload error';
      return res.status(400).json({ success: false, message });
    }

    try {
      const classroom = await resolveOwned(req, res);
      if (!classroom) return;

      const message = (req.body.message || '').trim();
      const hasFile = !!req.file;

      if (!message && !hasFile) {
        return res.status(400).json({
          success: false,
          message: 'A post must have a message or an attached file (or both)'
        });
      }

      const postData = {
        classroom: classroom._id,
        teacher: req.teacher.id,
        message
      };

      if (hasFile) {
        postData.attachedFile = {
          originalName: req.file.originalname,
          storedName: req.file.filename,
          filePath: req.file.path,
          fileType: req.file.mimetype,
          fileSize: req.file.size
        };
      }

      const post = await Post.create(postData);
      res.status(201).json({ success: true, data: post });
    } catch (error) {
      next(error);
    }
  });
});

/**
 * @desc    List posts for a classroom
 * @route   GET /api/classroom/:id/posts
 */
router.get('/:id/posts', async (req, res, next) => {
  try {
    const classroom = await resolveOwned(req, res);
    if (!classroom) return;

    const posts = await Post.find({ classroom: classroom._id })
      .sort({ createdAt: -1 })
      .populate('teacher', 'name');

    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    next(error);
  }
});

/**
 * @desc    Delete a post
 * @route   DELETE /api/classroom/:id/posts/:postId
 */
router.delete('/:id/posts/:postId', async (req, res, next) => {
  try {
    const classroom = await resolveOwned(req, res);
    if (!classroom) return;

    const post = await Post.findOne({ _id: req.params.postId, classroom: classroom._id });
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Delete attached file from disk if present
    if (post.attachedFile && post.attachedFile.filePath) {
      try {
        fs.unlinkSync(post.attachedFile.filePath);
      } catch (unlinkErr) {
        console.warn(`Could not delete file from disk (${post.attachedFile.filePath}):`, unlinkErr.message);
      }
    }

    await post.deleteOne();
    res.status(200).json({ success: true, message: 'Post deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
