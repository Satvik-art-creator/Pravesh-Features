const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { createTeacher, revokeSession } = require('../controllers/admin.controller');

// @route   POST /api/admin/create-teacher
// @desc    Create a new teacher
// @access  Private (Admin only)
router.post(
  '/create-teacher',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  createTeacher
);

// @route   POST /api/admin/revoke-session/:teacherId
// @desc    Revoke a teacher's session
// @access  Private (Admin only)
router.post('/revoke-session/:teacherId', revokeSession);

module.exports = router;
