const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/StudentManagementDB')
    .then(() => console.log('MongoDB connected successfully'))
    .catch((error) => console.log('MongoDB connection failed:', error));