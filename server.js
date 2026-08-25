const express = require('express');
const Student = require('./models/Student');


const app = express();

app.use(express.json());  // JSON request read middleware

const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/api/students', async (req, res) => {
    const students = await Student.find();
    res.json(students);
});

app.get('/api/students/:id', async (req, res) => {
    const student = await Student.findById(req.params.id);

    if (!student) {
        return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
});

app.put('/api/students/:id', async (req, res) => {
    const student = await Student.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    if (!student) {
        return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
});

app.post('/api/students', async (req, res) => {
    const student = new Student(req.body);

    await student.save();

    res.json(student);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.delete('/api/students/:id', async (req, res) => {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
        return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Student deleted successfully' });
});

require('./db');