const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  classroom: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom', required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  message: { type: String, default: '' },
  attachedFile: {
    originalName: String,
    storedName: String,
    filePath: String,
    fileType: String,
    fileSize: Number
  },
  createdAt: { type: Date, default: Date.now }
});

postSchema.index({ classroom: 1, createdAt: -1 });

module.exports = mongoose.model('Post', postSchema);
