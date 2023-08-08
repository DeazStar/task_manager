const crypto = require('crypto');
const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const validator = require('validator');
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide your username'],
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
  passwordUpdatedAt: {
    type: Date,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  }
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

userSchema.methods.checkExpiredToken = async function (TokenIssuedDate) {
  if (this.passwordUpdatedAt) {
    const updatedTimeStamp = this.passwordUpdatedAt.getTime() / 1000;

    return TokenIssuedDate < updatedTimeStamp;
  }
  return false;
};

userSchema.methods.generateResetToken = function () {
  const token = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return token;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
