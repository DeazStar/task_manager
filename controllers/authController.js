/* eslint-disable import/no-extraneous-dependencies */
const { promisify } = require('util');
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
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
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

const protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else {
    return next(
      new AppError('You must login first to access this resources', 401),
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.userId);

  if (!user) {
    return next(new AppError('the user of this token no longer exist!', 401));
  }

  if (await user.checkExpiredToken(decoded.iat)) {
    return next(
      new AppError('user recently changed password. please login again', 401),
    );
  }

  req.user = user;
  next();
});

const restrictTo =
  (...role) =>
  async (req, res, next) => {
    if (!role.includes(req.user.role)) {
      return next("You don't have permission to perform this action", 403);
    }

    next();
  };

module.exports = {
  signup,
  login,
  protect,
  restrictTo,
};
