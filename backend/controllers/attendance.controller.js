const { v4: uuidv4 } = require('uuid');
const Attendance = require('../models/Attendance');
const Classroom = require('../models/Classroom');
const Student = require('../models/Student');
const isWifiVerified = require('../utils/wifiVerify');

/**
 * @desc    Generate a new attendance session (QR code data)
 * @route   POST /api/attendance/:classroomId/generate
 * @access  Private (Teacher)
 */
const generateSession = async (req, res, next) => {
  try {
    const classroom = await Classroom.findById(req.params.classroomId);

    if (!classroom) {
      return res.status(404).json({ success: false, message: 'Classroom not found' });
    }

    // Ownership check
    if (classroom.teacher.toString() !== req.teacher.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to generate attendance for this classroom' });
    }

    // Generate a long, unguessable session ID (UUID v4 — 122 bits of randomness)
    const sessionId = uuidv4();

    // Session duration is configurable; defaults to 10 minutes
    const durationMinutes = parseInt(process.env.SESSION_DURATION_MINUTES, 10) || 10;
    const expiresAt = new Date(Date.now() + durationMinutes * 60 * 1000);

    const attendance = await Attendance.create({
      classroom: classroom._id,
      sessionId,
      expiresAt,
      records: []
    });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5174';

    res.status(201).json({
      success: true,
      data: {
        sessionId: attendance.sessionId,
        expiresAt: attendance.expiresAt,
        joinUrl: `${frontendUrl}/attend/${attendance.sessionId}`
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Validate an attendance session (public — student's page loads this before showing form)
 * @route   GET /api/attendance/scan/:sessionId
 * @access  Public
 */
const validateSession = async (req, res, next) => {
  try {
    const attendance = await Attendance.findOne({ sessionId: req.params.sessionId })
      .populate({
        path: 'classroom',
        select: 'className subject'
      });

    if (!attendance) {
      return res.status(404).json({ success: false, message: 'Invalid session' });
    }

    if (attendance.expiresAt < new Date()) {
      return res.status(410).json({ success: false, message: 'This attendance session has expired' });
    }

    res.status(200).json({
      success: true,
      data: {
        className: attendance.classroom.className,
        subject: attendance.classroom.subject
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Submit attendance (public — student scans QR and submits BT ID)
 * @route   POST /api/attendance/scan/:sessionId
 * @access  Public
 *
 * CONCURRENCY SAFETY:
 * This endpoint is designed to safely handle ~150+ students submitting within the
 * same few seconds. The key mechanism is an atomic findOneAndUpdate with a $ne
 * condition on records.btechId — MongoDB executes this as a single atomic operation,
 * so even if two requests for the same student arrive simultaneously, only one will
 * match the $ne condition and push a record. The other will get null back and be
 * treated as "already marked" (idempotent).
 *
 * DO NOT refactor this to a find() + save() pattern — that is NOT safe under
 * concurrent writes and WILL produce duplicate records.
 */
const submitAttendance = async (req, res, next) => {
  try {
    // 1. Validate btechId is present
    const { btechId } = req.body;
    if (!btechId || typeof btechId !== 'string' || !btechId.trim()) {
      return res.status(400).json({ success: false, message: 'BT ID is required' });
    }

    // 2. Normalize btechId
    const normalizedBtechId = btechId.trim().toUpperCase();

    // 3. Fetch attendance session and check validity
    const attendance = await Attendance.findOne({ sessionId: req.params.sessionId });

    if (!attendance) {
      return res.status(404).json({ success: false, message: 'Invalid session' });
    }

    if (attendance.expiresAt < new Date()) {
      return res.status(410).json({ success: false, message: 'This attendance session has expired' });
    }

    // 4. Verify the student exists and is a member of the classroom
    const student = await Student.findOne({ btechId: normalizedBtechId });

    if (!student) {
      return res.status(403).json({
        success: false,
        message: 'You are not registered in this class. Please join the class first.'
      });
    }

    const classroom = await Classroom.findById(attendance.classroom);

    if (!classroom || !classroom.students.some(s => s.toString() === student._id.toString())) {
      return res.status(403).json({
        success: false,
        message: 'You are not registered in this class. Please join the class first.'
      });
    }

    // 5. WiFi/IP verification
    // req.ip is reliable here because trust proxy is enabled in server.js,
    // so Express correctly parses X-Forwarded-For from reverse proxies / load balancers.
    const clientIp = req.ip;
    const wifiOk = isWifiVerified(clientIp);

    if (!wifiOk) {
      return res.status(403).json({
        success: false,
        message: 'Attendance can only be marked while connected to college WiFi'
      });
    }

    // 6. Atomically record attendance — the $ne condition ensures no duplicate records
    // even under heavy concurrent load. If another request for the same btechId races
    // this one, only one will succeed in matching the $ne filter; the other gets null.
    const updated = await Attendance.findOneAndUpdate(
      { sessionId: req.params.sessionId, 'records.btechId': { $ne: normalizedBtechId } },
      {
        $push: {
          records: {
            student: student._id,
            btechId: normalizedBtechId,
            timestamp: new Date(),
            ipAddress: clientIp,
            wifiVerified: wifiOk
          }
        }
      },
      { new: true }
    );

    if (!updated) {
      // Session exists (confirmed in step 3), so null means the $ne filter didn't match
      // → this student already has a record. Return success (idempotent).
      return res.status(200).json({
        success: true,
        message: 'Attendance already recorded'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Attendance marked successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get attendance history (session list) for a classroom
 * @route   GET /api/attendance/:classroomId
 * @access  Private (Teacher)
 */
const getAttendanceHistory = async (req, res, next) => {
  try {
    const classroom = await Classroom.findById(req.params.classroomId);

    if (!classroom) {
      return res.status(404).json({ success: false, message: 'Classroom not found' });
    }

    if (classroom.teacher.toString() !== req.teacher.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this classroom' });
    }

    const sessions = await Attendance.find({ classroom: classroom._id })
      .sort({ date: -1 })
      .select('sessionId date expiresAt records');

    const summary = sessions.map(session => ({
      sessionId: session.sessionId,
      date: session.date,
      expiresAt: session.expiresAt,
      presentCount: session.records.length
    }));

    res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single session detail with populated student records
 * @route   GET /api/attendance/:classroomId/session/:sessionId
 * @access  Private (Teacher)
 */
const getSessionDetail = async (req, res, next) => {
  try {
    const classroom = await Classroom.findById(req.params.classroomId);

    if (!classroom) {
      return res.status(404).json({ success: false, message: 'Classroom not found' });
    }

    if (classroom.teacher.toString() !== req.teacher.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this classroom' });
    }

    const attendance = await Attendance.findOne({
      sessionId: req.params.sessionId,
      classroom: classroom._id
    }).populate({
      path: 'records.student',
      select: 'name btechId'
    });

    if (!attendance) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    res.status(200).json({
      success: true,
      data: {
        sessionId: attendance.sessionId,
        date: attendance.date,
        expiresAt: attendance.expiresAt,
        records: attendance.records.map(record => ({
          name: record.student ? record.student.name : 'Unknown',
          btechId: record.btechId,
          timestamp: record.timestamp,
          wifiVerified: record.wifiVerified
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateSession,
  validateSession,
  submitAttendance,
  getAttendanceHistory,
  getSessionDetail
};
