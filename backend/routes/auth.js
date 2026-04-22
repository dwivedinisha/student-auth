const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const authMiddleware = require('../middleware/auth');

// POST /api/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, course } = req.body;
    const existing = await Student.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const student = await Student.create({ name, email, password: hashed, course });
    res.status(201).json({ message: 'Registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ email });
    if (!student) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, student.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, student: { name: student.name, email: student.email, course: student.course } });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/update-password (protected)
router.put('/update-password', authMiddleware, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const student = await Student.findById(req.studentId);
    const match = await bcrypt.compare(oldPassword, student.password);
    if (!match) return res.status(400).json({ message: 'Old password incorrect' });

    student.password = await bcrypt.hash(newPassword, 10);
    await student.save();
    res.json({ message: 'Password updated' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/update-course (protected)
router.put('/update-course', authMiddleware, async (req, res) => {
  try {
    const { course } = req.body;
    await Student.findByIdAndUpdate(req.studentId, { course });
    res.json({ message: 'Course updated' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/dashboard (protected)
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const student = await Student.findById(req.studentId).select('-password');
    res.json(student);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;