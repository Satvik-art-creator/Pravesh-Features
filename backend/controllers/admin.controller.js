const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const Teacher = require('../models/Teacher');

/**
 * Create a new Teacher (Admin Protected)
 * Method: POST
 * Route: /api/admin/create-teacher
 * Body: { name, email, password }
 */
const createTeacher = async (req, res, next) => {
  try {
    // Verify admin key from headers
    const adminKey = req.headers['x-admin-key'];
    if (!adminKey || adminKey !== process.env.ADMIN_SECRET_KEY) {
      console.log('Header received:', JSON.stringify(req.headers['x-admin-key']));
console.log('Env value:', JSON.stringify(process.env.ADMIN_SECRET_KEY));
      return res.status(403).json({ success: false, message: 'Forbidden: Invalid Admin Key' });
    }

    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation Error', errors: errors.array() });
    }

    const { name, email, password } = req.body;

    // Check if teacher already exists
    let teacher = await Teacher.findOne({ email });
    if (teacher) {
      return res.status(400).json({ success: false, message: 'Teacher already exists with this email' });
    }

    // Hash the password
    const saltRounds = 12;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the teacher
    teacher = new Teacher({
      name,
      email,
      password: hashedPassword,
    });

    await teacher.save();

    // Return the created teacher without password
    res.status(201).json({
      success: true,
      message: 'Teacher created successfully',
      data: {
        id: teacher._id.toString(),
        name: teacher.name,
        email: teacher.email,
        createdAt: teacher.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Revoke Teacher Session (Admin Protected)
 * Method: POST
 * Route: /api/admin/revoke-session/:teacherId
 * Increments the teacher's tokenVersion to invalidate existing tokens.
 */
const revokeSession = async (req, res, next) => {
  try {
    // Verify admin key from headers
    const adminKey = req.headers['x-admin-key'];
    if (!adminKey || adminKey !== process.env.ADMIN_SECRET_KEY) {
      return res.status(403).json({ success: false, message: 'Forbidden: Invalid Admin Key' });
    }

    const { teacherId } = req.params;

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    // Increment tokenVersion
    teacher.tokenVersion += 1;
    await teacher.save();

    res.status(200).json({
      success: true,
      message: 'Teacher session revoked successfully. All current tokens are now invalid.',
      data: {
        id: teacher._id.toString(),
        name: teacher.name,
        email: teacher.email,
        newTokenVersion: teacher.tokenVersion,
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTeacher,
  revokeSession,
};
