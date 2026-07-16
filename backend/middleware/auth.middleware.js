const jwt = require('jsonwebtoken');
const Teacher = require('../models/Teacher');


const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, token missing' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the teacher by ID
    const teacher = await Teacher.findById(decoded.teacherId);
    
    if (!teacher) {
      return res.status(401).json({ success: false, message: 'Not authorized, teacher not found' });
    }

    // Check if token version matches (for session revocation)
    if (decoded.tokenVersion !== teacher.tokenVersion) {
      return res.status(401).json({ success: false, message: 'Session expired or revoked. Please login again.' });
    }

    // Attach teacher info to request
    req.teacher = {
      id: teacher._id.toString(),
      email: teacher.email,
    };

    next();
  } catch (error) {
    console.error(`JWT Verification Error: ${error.message}`);
    return res.status(401).json({ success: false, message: 'Not authorized, token invalid or expired' });
  }
};

module.exports = { protect };
