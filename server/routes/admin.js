import express from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import Student from '../models/Student.js';
import Candidate from '../models/Candidate.js';
import Position from '../models/Position.js';
import Vote from '../models/Vote.js';
import ActivityLog from '../models/ActivityLog.js';

const router = express.Router();

// Apply authentication middleware
router.use(authenticate);
router.use(requireAdmin);

// Get dashboard statistics
router.get('/dashboard', async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalCandidates = await Candidate.countDocuments();
    const totalPositions = await Position.countDocuments();
    const totalVotes = await Vote.countDocuments();
    
    const recentActivity = await ActivityLog.find()
      .populate('user', 'name email')
      .sort({ timestamp: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        totalStudents,
        totalCandidates,
        totalPositions,
        totalVotes,
        recentActivity
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Student management
router.get('/students', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const query = search ? {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    } : {};

    const students = await Student.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Student.countDocuments(query);

    res.json({
      success: true,
      data: {
        students,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/students', async (req, res) => {
  try {
    const { studentId, name, email, password } = req.body;

    const existingStudent = await Student.findOne({ 
      $or: [{ email }, { studentId }] 
    });
    
    if (existingStudent) {
      return res.status(400).json({ 
        success: false, 
        message: 'Student already exists' 
      });
    }

    const student = new Student({
      studentId,
      name,
      email,
      password
    });

    await student.save();

    // Log activity
    await ActivityLog.create({
      user: req.user._id,
      userType: 'Admin',
      action: 'CREATE_STUDENT',
      details: `Created student: ${name} (${studentId})`,
      ipAddress: req.ip
    });

    res.status(201).json({
      success: true,
      message: 'Student created successfully'
    });
  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/students/:id', async (req, res) => {
  try {
    const { name, email, studentId, password } = req.body;
    const updateData = { name, email, studentId };
    
    if (password) {
      updateData.password = password;
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-password');

    if (!student) {
      return res.status(404).json({ 
        success: false, 
        message: 'Student not found' 
      });
    }

    // Log activity
    await ActivityLog.create({
      user: req.user._id,
      userType: 'Admin',
      action: 'UPDATE_STUDENT',
      details: `Updated student: ${name} (${studentId})`,
      ipAddress: req.ip
    });

    res.json({
      success: true,
      message: 'Student updated successfully',
      data: student
    });
  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.delete('/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({ 
        success: false, 
        message: 'Student not found' 
      });
    }

    // Log activity
    await ActivityLog.create({
      user: req.user._id,
      userType: 'Admin',
      action: 'DELETE_STUDENT',
      details: `Deleted student: ${student.name} (${student.studentId})`,
      ipAddress: req.ip
    });

    res.json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Position management
router.get('/positions', async (req, res) => {
  try {
    const positions = await Position.find()
      .populate('candidates')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: positions
    });
  } catch (error) {
    console.error('Get positions error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/positions', async (req, res) => {
  try {
    const { title, description, startTime, endTime } = req.body;

    const position = new Position({
      title,
      description,
      startTime: new Date(startTime),
      endTime: new Date(endTime)
    });

    await position.save();

    // Log activity
    await ActivityLog.create({
      user: req.user._id,
      userType: 'Admin',
      action: 'CREATE_POSITION',
      details: `Created position: ${title}`,
      ipAddress: req.ip
    });

    res.status(201).json({
      success: true,
      message: 'Position created successfully',
      data: position
    });
  } catch (error) {
    console.error('Create position error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Candidate management
router.get('/candidates', async (req, res) => {
  try {
    const candidates = await Candidate.find()
      .populate('position')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: candidates
    });
  } catch (error) {
    console.error('Get candidates error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/candidates', async (req, res) => {
  try {
    const { name, studentId, positionId, description, manifesto } = req.body;

    const candidate = new Candidate({
      name,
      studentId,
      position: positionId,
      description,
      manifesto
    });

    await candidate.save();

    // Add candidate to position
    await Position.findByIdAndUpdate(
      positionId,
      { $push: { candidates: candidate._id } }
    );

    // Log activity
    await ActivityLog.create({
      user: req.user._id,
      userType: 'Admin',
      action: 'CREATE_CANDIDATE',
      details: `Created candidate: ${name} (${studentId})`,
      ipAddress: req.ip
    });

    res.status(201).json({
      success: true,
      message: 'Candidate created successfully',
      data: candidate
    });
  } catch (error) {
    console.error('Create candidate error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Results
router.get('/results', async (req, res) => {
  try {
    const positions = await Position.find()
      .populate({
        path: 'candidates',
        options: { sort: { voteCount: -1 } }
      });

    const results = positions.map(position => ({
      position: position.title,
      totalVotes: position.candidates.reduce((sum, candidate) => sum + candidate.voteCount, 0),
      candidates: position.candidates.map(candidate => ({
        name: candidate.name,
        studentId: candidate.studentId,
        voteCount: candidate.voteCount,
        percentage: position.candidates.reduce((sum, c) => sum + c.voteCount, 0) > 0 
          ? Math.round((candidate.voteCount / position.candidates.reduce((sum, c) => sum + c.voteCount, 0)) * 100)
          : 0
      }))
    }));

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Get results error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;