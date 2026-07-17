const express = require('express');
const Classroom = require('../models/Classroom');
const Post = require('../models/Post');

const router = express.Router();

/**
 * @desc    Public: list posts for a classroom by class code (no auth)
 * @route   GET /api/public/classroom/:classCode/posts
 * @access  Public
 */
router.get('/classroom/:classCode/posts', async (req, res, next) => {
  try {
    const classCode = req.params.classCode.toUpperCase();
    const classroom = await Classroom.findOne({ classCode });

    if (!classroom) {
      return res.status(404).json({ success: false, message: 'Invalid class code' });
    }

    const posts = await Post.find({ classroom: classroom._id })
      .sort({ createdAt: -1 })
      .populate('teacher', 'name');

    const baseUrl = process.env.BACKEND_URL || 'http://localhost:8080';

    const data = posts.map((p) => {
      const item = {
        message: p.message,
        teacherName: p.teacher ? p.teacher.name : 'Teacher',
        createdAt: p.createdAt
      };

      if (p.attachedFile && p.attachedFile.storedName) {
        item.attachedFile = {
          originalName: p.attachedFile.originalName,
          fileType: p.attachedFile.fileType,
          fileSize: p.attachedFile.fileSize,
          downloadUrl: `${baseUrl}/uploads/${p.attachedFile.storedName}`
        };
      }

      return item;
    });

    res.status(200).json({
      success: true,
      data,
      classroom: { className: classroom.className, subject: classroom.subject }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
