const express = require('express');
const cors = require('cors');
const Student = require('./models/student');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/authMiddleware');


const app = express();
app.use(cors());
app.use(express.json());  // JSON request read middleware
app.use('/api/auth', authRoutes);
app.use(authMiddleware);  // Apply auth middleware to all routes below

const port = 3000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
    


app.get('/api/students', async (req, res) => {
    try {
    const students = await Student.find();
    res.json(students);
} catch (error) {
    res.status(500).json({ message: 'Error fetching students'});
}
});

app.get('/api/students/:id', async (req, res) => {
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

app.put('/api/students/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
        { new: true }
    );

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
    const student = new Student(req.body);

    await student.save();

    res.json(student);
} catch (error) {
    res.status(400).json({ message: error.message });
}
});



app.delete('/api/students/:id', async (req, res) => {
    try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
        return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Student deleted successfully' });
} catch (error) {
    res.status(400).json({ message: 'Invalid Student ID' });
}});

require('./db');