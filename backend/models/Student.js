const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  btechId: { type: String, required: true, unique: true, uppercase: true, trim: true },
  classrooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Classroom' }],
  createdAt: { type: Date, default: Date.now }
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
