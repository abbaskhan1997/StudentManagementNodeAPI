const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: String,
    email: String,
    phone: String,
    age: Number,
    course: String,
    gender: String,

    userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true
}
  });

  module.exports = mongoose.model('Student', studentSchema);
