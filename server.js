require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Student = require('./models/student');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/authMiddleware');



const app = express();



// const app = express();
app.use(cors());
app.use(express.json());  // JSON request read middleware
app.use('/api/auth', authRoutes);
// app.use(authMiddleware);  // Apply auth middleware to all routes below

const port = 3000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
    


app.get('/api/students', authMiddleware, async (req, res) => {
  try {

    let students;

    if (req.user.role === 'Admin') {
      students = await Student.find();
    } else {
      students = await Student.find({
        userId: req.user.userId
      });
    }

    res.json(students);

  } catch (error) {
    res.status(500).json({
      message: 'Error fetching students'
    });
  }
});

app.get('/api/students/:id', authMiddleware, async (req, res) => {
    try {
    const student = await Student.findById(req.params.id);

    if (!student) {
        return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
} catch (error) {
    res.status(400).json({ message: 'Invalid Student ID' });
}
});

app.post('/api/students', authMiddleware, async (req, res) => {
    try {
    const student = new Student({
         userId: req.user.userId, ...req.body
         });

    await student.save();

    res.json(student);
} catch (error) {
    res.status(400).json({ message: error.message });
}
});

app.put('/api/students/:id', authMiddleware, async (req, res) => {
  try {

    let student;

    if (req.user.role === 'Admin') {

      student = await Student.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    } else {

      student = await Student.findOneAndUpdate(
        {
          _id: req.params.id,
          userId: req.user.userId
        },
        req.body,
        { new: true }
      );

    }

    if (!student) {
      return res.status(404).json({
        message: 'Student not found or you do not have access'
      });
    }

    res.json(student);

  } catch (error) {
    res.status(400).json({
      message: 'Invalid Student ID'
    });
  }
});


app.delete('/api/students/:id', authMiddleware, async (req, res) => {
  try {

    let student;

    if (req.user.role === 'Admin') {

      student = await Student.findByIdAndDelete(req.params.id);

    } else {

      student = await Student.findOneAndDelete({
        _id: req.params.id,
        userId: req.user.userId
      });

    }

    if (!student) {
      return res.status(404).json({
        message: 'Student not found or you do not have access'
      });
    }

    res.json({
      message: 'Student deleted successfully'
    });

  } catch (error) {
    res.status(400).json({
      message: 'Invalid Student ID'
    });
  }
});

require('./db');