const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const validator = require('validator');
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  userName: {
    type: String,
    required: [true, 'Please provide your full name'],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email address'],
    validate: [validator.isEmail, 'Invalid email address'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide your password'],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm the password'],
    validate: {
      validator: function (el) {
        return this.password === el;
      },
      message: 'password should be the same',
    },
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;
  }

  next();
});

userSchema.methods.correctPassword = async function (password, userPassword) {
  return await bcrypt.compare(password, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
