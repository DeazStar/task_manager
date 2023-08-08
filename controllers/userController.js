const AppError = require('../errors/AppError');
const catchAsync = require('../errors/catchAsync');
const User = require('../models/userModel');
const Features = require('../utils/Features');

const createUser = catchAsync(async (req, res, next) => {
  const user = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  });

  res.status(201).json({
    status: 'success',
    data: {
      user,
    },
  });
});

const getUsers = catchAsync(async (req, res, next) => {
  const features = new Features(User.find({ active: true }), req.query)
    .filter()
    .sort()
    .excludePassword()
    .limitFields()
    .paginate();

  const users = await features.query;

  console.log(users);

  console.log(users);
  res.status(200).json({
    status: 'success',
    data: {
      users,
    },
  });
});

const getUserById = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

const updateUser = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidation: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

const deleteUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.params.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

const updateCurrentUser = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'this route is not for updating password use /api/v1/user/updatePassword',
      ),
    );
  }
  const updatedUser = await User.findByIdAndUpdate(req.user.id, {
    username: req.body.username,
    email: req.body.email,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

const deleteCurrentUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

const updateCurrentPassword = catchAsync(async (req, res, next) => {
  const user = User.findById(req.user.id);

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  user.save();

  res.status(200).json({
    status: 'success',
    message: 'password updated successfully',
  });
});

module.exports = {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  updateCurrentUser,
  deleteCurrentUser,
  updateCurrentPassword,
};
