const catchAsync = require('../errors/catchAsync');
const User = require('../models/userModel');
const Features = require('../utils/Features');

const getUsers = catchAsync(async (req, res, next) => {
  const features = new Features(User.find(), req.query)
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

module.exports = {
  getUsers,
};
