const { validationResult } = require('express-validator');
const { Parser } = require('json2csv');
const Grade = require('../models/Grade');
const Classroom = require('../models/Classroom');
const Student = require('../models/Student');

/**
 * Helper — verify classroom exists and belongs to the requesting teacher.
 * Returns { classroom } on success, or sends error response and returns null.
 */
const resolveClassroom = async (req, res) => {
  const classroom = await Classroom.findById(req.params.classroomId);
  if (!classroom) {
    res.status(404).json({ success: false, message: 'Classroom not found' });
    return null;
  }
  if (classroom.teacher.toString() !== req.teacher.id) {
    res.status(403).json({ success: false, message: 'Not authorized to access this classroom' });
    return null;
  }
  return classroom;
};

/**
 * @desc    Create a new exam for a classroom (auto-populates all current students)
 * @route   POST /api/grades/:classroomId/exam
 * @access  Private (Teacher)
 */
const createExam = async (req, res, next) => {
  try {
    // express-validator errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const classroom = await resolveClassroom(req, res);
    if (!classroom) return;

    // Populate full student documents so we can snapshot name + btechId
    const populatedClassroom = await Classroom.findById(classroom._id).populate('students', 'name btechId');

    const { examName, maxMarks } = req.body;

    const records = (populatedClassroom.students || []).map((student) => ({
      student: student._id,
      btechId: student.btechId,
      name: student.name,
      marksObtained: null
    }));

    const grade = await Grade.create({
      classroom: classroom._id,
      examName: examName.trim(),
      maxMarks: Number(maxMarks),
      records
    });

    res.status(201).json({ success: true, data: grade });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    List all exams for a classroom (summary — no full records)
 * @route   GET /api/grades/:classroomId
 * @access  Private (Teacher)
 */
const listExams = async (req, res, next) => {
  try {
    const classroom = await resolveClassroom(req, res);
    if (!classroom) return;

    const exams = await Grade.find({ classroom: classroom._id })
      .sort({ createdAt: -1 })
      .select('examName maxMarks records createdAt');

    const summary = exams.map((exam) => ({
      _id: exam._id,
      examName: exam.examName,
      maxMarks: exam.maxMarks,
      studentsCount: exam.records.length,
      createdAt: exam.createdAt
    }));

    res.status(200).json({ success: true, data: summary });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single exam detail with full records
 * @route   GET /api/grades/:classroomId/exam/:examId
 * @access  Private (Teacher)
 */
const getExamDetail = async (req, res, next) => {
  try {
    const classroom = await resolveClassroom(req, res);
    if (!classroom) return;

    const exam = await Grade.findOne({ _id: req.params.examId, classroom: classroom._id });
    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }

    res.status(200).json({ success: true, data: exam });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Bulk-update marks for an exam
 * @route   PUT /api/grades/:classroomId/exam/:examId
 * @access  Private (Teacher)
 * Body: { records: [{ btechId, marksObtained }] }
 */
const updateMarks = async (req, res, next) => {
  try {
    const classroom = await resolveClassroom(req, res);
    if (!classroom) return;

    const exam = await Grade.findOne({ _id: req.params.examId, classroom: classroom._id });
    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }

    const incoming = req.body.records;
    if (!Array.isArray(incoming)) {
      return res.status(400).json({ success: false, message: 'records must be an array' });
    }

    // Validate all values before saving anything
    const validationErrors = [];
    for (const item of incoming) {
      const { btechId, marksObtained } = item;
      if (marksObtained !== null && marksObtained !== undefined) {
        const val = Number(marksObtained);
        if (isNaN(val) || val < 0 || val > exam.maxMarks) {
          validationErrors.push(`${btechId}: marksObtained must be between 0 and ${exam.maxMarks}, got ${marksObtained}`);
        }
      }
    }
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed for one or more records',
        errors: validationErrors
      });
    }

    // Apply updates
    const updateMap = new Map(incoming.map((item) => [item.btechId, item.marksObtained]));
    for (const record of exam.records) {
      if (updateMap.has(record.btechId)) {
        const val = updateMap.get(record.btechId);
        record.marksObtained = (val === null || val === undefined || val === '') ? null : Number(val);
      }
    }

    await exam.save();
    res.status(200).json({ success: true, data: exam });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete an exam
 * @route   DELETE /api/grades/:classroomId/exam/:examId
 * @access  Private (Teacher)
 */
const deleteExam = async (req, res, next) => {
  try {
    const classroom = await resolveClassroom(req, res);
    if (!classroom) return;

    const exam = await Grade.findOne({ _id: req.params.examId, classroom: classroom._id });
    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }

    await exam.deleteOne();
    res.status(200).json({ success: true, message: 'Exam deleted' });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Export exam grades as CSV
 * @route   GET /api/grades/:classroomId/exam/:examId/export
 * @access  Private (Teacher)
 */
const exportCsv = async (req, res, next) => {
  try {
    const classroom = await resolveClassroom(req, res);
    if (!classroom) return;

    const exam = await Grade.findOne({ _id: req.params.examId, classroom: classroom._id });
    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }

    const fields = [
      { label: 'BT ID', value: 'btechId' },
      { label: 'Name', value: 'name' },
      { label: 'Marks Obtained', value: 'marksObtained' },
      { label: 'Max Marks', value: 'maxMarks' }
    ];

    const data = exam.records.map((r) => ({
      btechId: r.btechId,
      name: r.name,
      marksObtained: r.marksObtained !== null && r.marksObtained !== undefined ? r.marksObtained : '',
      maxMarks: exam.maxMarks
    }));

    const parser = new Parser({ fields });
    const csv = parser.parse(data);

    // Sanitize exam name for use as a filename
    const safeExamName = exam.examName.replace(/[^a-zA-Z0-9]/g, '-');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${safeExamName}-grades.csv"`);
    res.send(csv);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createExam,
  listExams,
  getExamDetail,
  updateMarks,
  deleteExam,
  exportCsv
};
