const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  classroom: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom', required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  originalName: { type: String, required: true },   // e.g. "Stack and Queue Notes.pdf"
  storedName: { type: String, required: true },       // e.g. "1721234567-Stack-and-Queue-Notes.pdf"
  filePath: { type: String, required: true },         // e.g. "uploads/1721234567-Stack-and-Queue-Notes.pdf"
  fileType: { type: String, required: true },         // mimetype
  fileSize: { type: Number, required: true },         // bytes
  uploadedAt: { type: Date, default: Date.now }
});

// Index for fetching files by classroom, sorted by upload date
fileSchema.index({ classroom: 1, uploadedAt: -1 });

module.exports = mongoose.model('File', fileSchema);
