const { validationResult } = require('express-validator');
const Classroom = require('../models/Classroom');
const generateUniqueClassCode = require('../utils/generateClassCode');

/**
 * @desc    Create a new classroom
 * @route   POST /api/classroom
 * @access  Private (Teacher)
 */
const createClassroom = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const { className, section, subject, semester, room } = req.body;

    const classCode = await generateUniqueClassCode();

    const classroom = await Classroom.create({
      className,
      section,
      subject,
      semester,
      room,
      classCode,
      teacher: req.teacher.id,
      students: []
    });

    res.status(201).json({
      success: true,
      message: 'Classroom created successfully',
      data: classroom
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all classrooms for the logged-in teacher
 * @route   GET /api/classroom
 * @access  Private (Teacher)
 */
const getClassrooms = async (req, res, next) => {
  try {
    const classrooms = await Classroom.find({ teacher: req.teacher.id }).sort({ createdAt: -1 });

    const classroomsWithCount = classrooms.map(cls => {
      const clsObj = cls.toObject();
      clsObj.studentsCount = clsObj.students.length;
      return clsObj;
    });

    res.status(200).json({
      success: true,
      data: classroomsWithCount
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single classroom by ID
 * @route   GET /api/classroom/:id
 * @access  Private (Teacher)
 */
const getClassroomById = async (req, res, next) => {
  try {
    const classroom = await Classroom.findById(req.params.id);

    if (!classroom) {
      return res.status(404).json({ success: false, message: 'Classroom not found' });
    }

    if (classroom.teacher.toString() !== req.teacher.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to access this classroom' });
    }

    res.status(200).json({
      success: true,
      data: classroom
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a classroom
 * @route   DELETE /api/classroom/:id
 * @access  Private (Teacher)
 */
const deleteClassroom = async (req, res, next) => {
  try {
    const classroom = await Classroom.findById(req.params.id);

    if (!classroom) {
      return res.status(404).json({ success: false, message: 'Classroom not found' });
    }

    if (classroom.teacher.toString() !== req.teacher.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this classroom' });
    }

    await classroom.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Classroom deleted'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get the list of students in a classroom
 * @route   GET /api/classroom/:id/students
 * @access  Private (Teacher)
 */
const getClassroomStudents = async (req, res, next) => {
  try {
    const classroom = await Classroom.findById(req.params.id).populate('students');

    if (!classroom) {
      return res.status(404).json({ success: false, message: 'Classroom not found' });
    }

    if (classroom.teacher.toString() !== req.teacher.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to access this classroom' });
    }

    const formattedStudents = classroom.students.map(student => ({
      btechId: student.btechId,
      name: student.name,
      status: "Verified",
      attendancePercent: null,
      lastActivity: null
    }));

    res.status(200).json({
      success: true,
      data: formattedStudents
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createClassroom,
  getClassrooms,
  getClassroomById,
  deleteClassroom,
  getClassroomStudents
};
