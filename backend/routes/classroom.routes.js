const express = require('express');
const { body } = require('express-validator');
const {
  createClassroom,
  getClassrooms,
  getClassroomById,
  deleteClassroom,
  getClassroomStudents
} = require('../controllers/classroom.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// Apply auth middleware to all routes in this file
router.use(protect);

router.route('/')
  .get(getClassrooms)
  .post(
    [
      body('className').notEmpty().withMessage('Class name is required'),
      body('section').notEmpty().withMessage('Section is required'),
      body('subject').notEmpty().withMessage('Subject is required')
    ],
    createClassroom
  );

router.route('/:id')
  .get(getClassroomById)
  .delete(deleteClassroom);

router.route('/:id/students')
  .get(getClassroomStudents);

module.exports = router;
