const express = require('express');
const { body, validationResult } = require('express-validator');
const Classroom = require('../models/Classroom');
const Student = require('../models/Student');

const router = express.Router();

// GET /api/join/:classCode - Validate an invite code before showing the join form
router.get('/:classCode', async (req, res, next) => {
  try {
    const classCode = req.params.classCode.toUpperCase();
    const classroom = await Classroom.findOne({ classCode }).populate('teacher', 'name');

    if (!classroom) {
      return res.status(404).json({ success: false, message: "Invalid or expired class code" });
    }

    res.status(200).json({
      success: true,
      data: {
        className: classroom.className,
        section: classroom.section,
        subject: classroom.subject,
        teacherName: classroom.teacher ? classroom.teacher.name : 'Unknown Teacher'
      }
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/join/:classCode - Submit join form
router.post('/:classCode', [
  body('name').notEmpty().withMessage('Name is required').isString(),
  body('btechId').notEmpty().withMessage('BT ID is required').isString()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const { name, btechId } = req.body;
    const classCode = req.params.classCode.toUpperCase();

    const classroom = await Classroom.findOne({ classCode });
    if (!classroom) {
      return res.status(404).json({ success: false, message: "Invalid or expired class code" });
    }

    const normalizedBtechId = btechId.trim().toUpperCase();

    let student = await Student.findOne({ btechId: normalizedBtechId });
    if (!student) {
      student = await Student.create({ name, btechId: normalizedBtechId });
    }

    let addedToClassroom = false;
    if (!classroom.students.includes(student._id)) {
      classroom.students.push(student._id);
      await classroom.save();
      addedToClassroom = true;
    }
    
    if (!student.classrooms.includes(classroom._id)) {
      student.classrooms.push(classroom._id);
      await student.save();
    }

    res.status(200).json({
      success: true,
      message: addedToClassroom ? "Successfully joined classroom" : "You're already part of this classroom",
      data: {
        className: classroom.className,
        studentName: student.name
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
