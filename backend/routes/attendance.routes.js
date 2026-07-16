const express = require('express');
const rateLimit = require('express-rate-limit');
const {
  generateSession,
  validateSession,
  submitAttendance,
  getAttendanceHistory,
  getSessionDetail
} = require('../controllers/attendance.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// Rate limiter for the public scan-submit endpoint.
// Max 5 requests per minute per IP — prevents accidental rapid double-taps
// and basic abuse. Genuine students will only submit once per session.
const scanLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: {
    success: false,
    message: 'Too many attempts. Please wait a minute and try again.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// --- Public routes (no auth — students scan QR from their phones) ---

// Validate a session before showing the BT ID form
router.get('/scan/:sessionId', validateSession);

// Submit attendance (rate-limited)
router.post('/scan/:sessionId', scanLimiter, submitAttendance);

// --- Protected routes (teacher must be authenticated) ---

// Get attendance history for a classroom
router.get('/:classroomId', protect, getAttendanceHistory);

// Generate a new attendance session
router.post('/:classroomId/generate', protect, generateSession);

// Get single session detail
router.get('/:classroomId/session/:sessionId', protect, getSessionDetail);

module.exports = router;
