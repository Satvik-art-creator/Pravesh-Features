const express = require('express');
const router = express.Router();
const { loginTeacher, logoutTeacher } = require('../controllers/auth.controller');
const { loginLimiter } = require('../middleware/rateLimiter');

// @route   POST /api/auth/login
// @desc    Authenticate teacher & get token
// @access  Public
router.post('/login', loginLimiter, loginTeacher);

// @route   POST /api/auth/logout
// @desc    Logout teacher
// @access  Public (stateless on server, but endpoint provided for client consistency)
router.post('/logout', logoutTeacher);

module.exports = router;
