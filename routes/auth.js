const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {

  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    name,
    email,
    password: hashedPassword
  });

  await user.save();

  res.json({
    message: 'User registered successfully'
  });

});

// Login route
router.post('/login', async (req, res) => {

  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
 
  // jsonwebtoken
  const token = jwt.sign(
    { userId: user._id,
     role: user.role
  },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token });

});

module.exports = router;