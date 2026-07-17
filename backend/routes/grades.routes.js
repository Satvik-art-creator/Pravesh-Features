const express = require('express');
const { body } = require('express-validator');
const {
  createExam,
  listExams,
  getExamDetail,
  updateMarks,
  deleteExam,
  exportCsv
} = require('../controllers/grades.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// All grades routes require teacher authentication
router.use(protect);

// List exams for a classroom
router.get('/:classroomId', listExams);

// Create a new exam
router.post(
  '/:classroomId/exam',
  [
    body('examName').notEmpty().withMessage('Exam name is required').isString(),
    body('maxMarks')
      .notEmpty().withMessage('Max marks is required')
      .isNumeric().withMessage('Max marks must be a number')
      .custom((val) => Number(val) > 0).withMessage('Max marks must be a positive number')
  ],
  createExam
);

// Get single exam detail
router.get('/:classroomId/exam/:examId', getExamDetail);

// Bulk-update marks for an exam
router.put('/:classroomId/exam/:examId', updateMarks);

// Delete an exam
router.delete('/:classroomId/exam/:examId', deleteExam);

// Export CSV
router.get('/:classroomId/exam/:examId/export', exportCsv);

module.exports = router;
