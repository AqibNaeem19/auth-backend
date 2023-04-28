const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
  dateOfBirth: {
    type: Date,
    default: Date.now
  },
  resetPasswordCode: {
    type: String,
  },
  resetPasswordCodeExpiresAt: {
    type: Date,
  },
})

const User = mongoose.model('Users', userSchema);
module.exports = User;