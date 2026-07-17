const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  classroom: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom', required: true },
  examName: { type: String, required: true, trim: true },
  maxMarks: { type: Number, required: true },
  records: [
    {
      student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
      btechId: { type: String, required: true },
      name: { type: String, required: true },
      marksObtained: { type: Number, default: null }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

// Index for fetching exams by classroom, sorted by creation date
gradeSchema.index({ classroom: 1, createdAt: -1 });

module.exports = mongoose.model('Grade', gradeSchema);
