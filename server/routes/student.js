import express from 'express';
import { authenticate, requireStudent } from '../middleware/auth.js';
import Student from '../models/Student.js';
import Position from '../models/Position.js';
import Vote from '../models/Vote.js';

const router = express.Router();

// Apply authentication middleware
router.use(authenticate);
router.use(requireStudent);

// Get student profile
router.get('/profile', async (req, res) => {
  try {
    const student = await Student.findById(req.user._id)
      .select('-password')
      .populate('votingHistory.positionId', 'title')
      .populate('votingHistory.candidateId', 'name');

    res.json({
      success: true,
      data: student
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get voting dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const student = await Student.findById(req.user._id).select('-password');
    const now = new Date();
    
    // Get active positions
    const positions = await Position.find({
      isActive: true,
      startTime: { $lte: now },
      endTime: { $gte: now }
    }).populate('candidates');

    // Get student's voting status for each position
    const positionsWithStatus = positions.map(position => {
      const hasVoted = student.hasVoted.get(position._id.toString()) || false;
      return {
        ...position.toObject(),
        hasVoted,
        timeRemaining: position.endTime - now
      };
    });

    // Get total votes cast by student
    const totalVotes = await Vote.countDocuments({ student: req.user._id });

    res.json({
      success: true,
      data: {
        student: {
          name: student.name,
          studentId: student.studentId,
          email: student.email
        },
        positions: positionsWithStatus,
        totalVotes
      }
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get available positions for voting
router.get('/positions', async (req, res) => {
  try {
    const now = new Date();
    const positions = await Position.find({
      isActive: true,
      startTime: { $lte: now },
      endTime: { $gte: now }
    }).populate('candidates');

    res.json({
      success: true,
      data: positions
    });
  } catch (error) {
    console.error('Get positions error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;