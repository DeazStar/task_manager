/* eslint-disable import/no-extraneous-dependencies */
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../errors/catchAsync');
const AppError = require('../errors/AppError');

const sign = (userId) =>
  jwt.sign({ userId: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = sign(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

const login = catchAsync(async (req, res, next) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    return new AppError('username and password are required', 401);
  }

  const user = await User.findOne({ userName });

  if (!user || !(await user.correctPassword(password, user.password))) {
    return new AppError('incorrect username or password');
  }

  const token = sign(user._id);

  res.status(200).json({
    status: 'success',
    token,
  });
});

module.exports = {
  signup,
  login,
};
