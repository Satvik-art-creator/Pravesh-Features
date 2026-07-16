const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Teacher = require('../models/Teacher');

/**
 * Handle Teacher Login
 * Method: POST
 * Route: /api/auth/login
 * Body: { email, password }
 */
const loginTeacher = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Find teacher by email
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate JWT Access Token
    const payload = {
      teacherId: teacher._id.toString(),
      email: teacher.email,
      tokenVersion: teacher.tokenVersion,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '180d', // 6 months
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        teacher: {
          id: teacher._id.toString(),
          name: teacher.name,
          email: teacher.email,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle Teacher Logout
 * Method: POST
 * Route: /api/auth/logout
 * Stateless response as token is client-managed.
 */
const logoutTeacher = (req, res, next) => {
  try {
    // We just return success. The client should delete the token from localStorage/cookies.
    res.status(200).json({
      success: true,
      message: 'Logged out successfully. Please clear your token locally.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  loginTeacher,
  logoutTeacher,
};
