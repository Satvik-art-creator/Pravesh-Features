const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  classroom: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom', required: true },
  sessionId: { type: String, required: true, unique: true },
  date: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  records: [
    {
      student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
      btechId: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
      ipAddress: String,
      wifiVerified: { type: Boolean, default: false },
      deviceId: { type: String, required: true }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

// Compound index for fetching attendance history by classroom, sorted by date
attendanceSchema.index({ classroom: 1, date: -1 });

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
