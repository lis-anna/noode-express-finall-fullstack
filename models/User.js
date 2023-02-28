const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide first name'],
    minlength: 3,
    maxlength: 80,
  },
  lastname: {
    type: String,
    required: [true, 'Please provide  last name'],
    minlength: 1,
    maxlength: 80,
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'PLease provide valid email',
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    match: [
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!_@$%&?]).{6,20}$/,
      'Please provide a valid password. Length 6 to 20 characters, mimimum 1 digit, 1 capital letter and 1 special character are required. Only letters, numbers and special characters ! @ $ _ % & ? are allowed.',
    ],
    minlength: 6,
    maxlength: 20,
  },
});

UserSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name, lastname: this.lastname },
    'jwtSecret',
    {
      expiresIn: process.env.JWT_LIFE,
    }
  );
};

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model('User', UserSchema);
