const fs = require('fs');
const { validationResult } = require('express-validator');
const Classroom = require('../models/Classroom');
const Attendance = require('../models/Attendance');
const Grade = require('../models/Grade');
const Post = require('../models/Post');
const Student = require('../models/Student');
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
 * @desc    Delete a classroom and cascade-delete all related data
 * @route   DELETE /api/classroom/:id
 * @access  Private (Teacher)
 *
 * Cleanup order: attendance → grades → posts (with disk files) → student references → classroom.
 * The classroom document is deleted last so a partial failure doesn't orphan data.
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

    const classroomId = classroom._id;

    // 1. Delete all attendance records
    await Attendance.deleteMany({ classroom: classroomId });

    // 2. Delete all grade documents
    await Grade.deleteMany({ classroom: classroomId });

    // 3. Delete all posts — remove attached files from disk first
    const posts = await Post.find({ classroom: classroomId });
    for (const post of posts) {
      if (post.attachedFile && post.attachedFile.filePath) {
        try {
          fs.unlinkSync(post.attachedFile.filePath);
        } catch (unlinkErr) {
          console.warn(`Could not delete file (${post.attachedFile.filePath}):`, unlinkErr.message);
        }
      }
    }
    await Post.deleteMany({ classroom: classroomId });

    // 4. Remove this classroom from every student's classrooms array
    await Student.updateMany(
      { classrooms: classroomId },
      { $pull: { classrooms: classroomId } }
    );

    // 5. Delete the classroom document itself (last)
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
 * @desc    Get the list of students in a classroom with real attendance stats
 * @route   GET /api/classroom/:id/students
 * @access  Private (Teacher)
 *
 * Computes attendance % and last activity per student in a single pass over
 * all attendance sessions for this classroom — no per-student queries.
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

    // Fetch all attendance sessions for this classroom in one query
    const sessions = await Attendance.find(
      { classroom: classroom._id },
      { records: 1 }
    );
    const totalSessions = sessions.length;

    // Build a map: btechId → { count, lastTimestamp }
    const statsMap = new Map();
    for (const session of sessions) {
      for (const record of session.records) {
        const existing = statsMap.get(record.btechId);
        const ts = record.timestamp ? new Date(record.timestamp) : null;
        if (!existing) {
          statsMap.set(record.btechId, { count: 1, lastTimestamp: ts });
        } else {
          existing.count += 1;
          if (ts && (!existing.lastTimestamp || ts > existing.lastTimestamp)) {
            existing.lastTimestamp = ts;
          }
        }
      }
    }

    const formattedStudents = classroom.students.map(student => {
      const stats = statsMap.get(student.btechId);
      let attendancePercent = null;
      let lastActivity = null;

      if (totalSessions > 0 && stats) {
        attendancePercent = Math.round((stats.count / totalSessions) * 100);
        lastActivity = stats.lastTimestamp ? stats.lastTimestamp.toISOString() : null;
      } else if (totalSessions > 0) {
        // Student exists but has zero attendance
        attendancePercent = 0;
      }

      return {
        btechId: student.btechId,
        name: student.name,
        status: "Verified",
        attendancePercent,
        lastActivity
      };
    });

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
