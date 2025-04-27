const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  status: { type: String, default: 'Exited' },
  attendanceCount: { type: Number, default: 0 },
  entryTime: { type: Date, default: null },
  scanHistory: [
    {
      status: { type: String, enum: ['Entered', 'Exited'], required: true },
      time: { type: Date, required: true }
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
