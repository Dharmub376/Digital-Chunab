import express from 'express';
import { authenticate, requireStudent } from '../middleware/auth.js';
import Student from '../models/Student.js';
import Position from '../models/Position.js';
import Candidate from '../models/Candidate.js';
import Vote from '../models/Vote.js';
import ActivityLog from '../models/ActivityLog.js';

const router = express.Router();

// Apply authentication middleware
router.use(authenticate);
router.use(requireStudent);

// Cast a vote
router.post('/vote', async (req, res) => {
  try {
    const { positionId, candidateId } = req.body;
    const studentId = req.user._id;

    // Validate position exists and is active
    const position = await Position.findById(positionId);
    if (!position || !position.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Position not found or inactive'
      });
    }

    // Check if voting is within time window
    const now = new Date();
    if (now < position.startTime || now > position.endTime) {
      return res.status(400).json({
        success: false,
        message: 'Voting is not currently open for this position'
      });
    }

    // Validate candidate exists and belongs to the position
    const candidate = await Candidate.findById(candidateId);
    if (!candidate || candidate.position.toString() !== positionId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid candidate for this position'
      });
    }

    // Check if student has already voted for this position
    const existingVote = await Vote.findOne({
      student: studentId,
      position: positionId
    });

    if (existingVote) {
      return res.status(400).json({
        success: false,
        message: 'You have already voted for this position'
      });
    }

    // Create the vote
    const vote = new Vote({
      student: studentId,
      candidate: candidateId,
      position: positionId,
      ipAddress: req.ip
    });

    await vote.save();

    // Update candidate vote count
    await Candidate.findByIdAndUpdate(
      candidateId,
      { $inc: { voteCount: 1 } }
    );

    // Update student's voting status
    const student = await Student.findById(studentId);
    student.hasVoted.set(positionId.toString(), true);
    student.votingHistory.push({
      positionId,
      candidateId,
      votedAt: new Date()
    });
    await student.save();

    // Log activity
    await ActivityLog.create({
      user: studentId,
      userType: 'Student',
      action: 'CAST_VOTE',
      details: `Voted for ${candidate.name} in ${position.title}`,
      ipAddress: req.ip
    });

    res.json({
      success: true,
      message: 'Vote cast successfully',
      data: {
        position: position.title,
        candidate: candidate.name
      }
    });
  } catch (error) {
    console.error('Vote error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;