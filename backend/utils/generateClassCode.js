const Classroom = require('../models/Classroom');

const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excludes 0, O, 1, I

const generateUniqueClassCode = async () => {
  let code;
  let exists = true;
  
  while (exists) {
    code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Check if code exists in the database
    const existingClass = await Classroom.findOne({ classCode: code });
    if (!existingClass) {
      exists = false;
    }
  }
  
  return code;
};

module.exports = generateUniqueClassCode;
