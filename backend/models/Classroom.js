const mongoose = require('mongoose');

const classroomSchema = new mongoose.Schema({
  className: { type: String, required: true },
  section: { type: String, required: true },
  subject: { type: String, required: true },
  semester: { type: String },
  room: { type: String },
  classCode: { type: String, required: true, unique: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  createdAt: { type: Date, default: Date.now }
});

const Classroom = mongoose.model('Classroom', classroomSchema);

module.exports = Classroom;
