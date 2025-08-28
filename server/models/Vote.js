import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true
  },
  position: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Position',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  ipAddress: {
    type: String,
    required: true
  }
}, { timestamps: true });

// Ensure one vote per student per position
voteSchema.index({ student: 1, position: 1 }, { unique: true });

export default mongoose.model('Vote', voteSchema);