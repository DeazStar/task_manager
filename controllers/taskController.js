const Task = require('../models/taskModel');
const Features = require('../utils/Features');
const catchAsync = require('../errors/catchAsync');

const createTask = catchAsync(async (req, res, next) => {
  const task = await Task.create(req.body);

  res.status(201).json({
    status: 'success',
    taskLength: await Task.countDocuments(),
    data: {
      task,
    },
  });
});

const getAllTask = catchAsync(async (req, res, next) => {
  const features = new Features(Task.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const tasks = await features.query;

  res.status(200).json({
    status: 'success',
    resultLength: tasks.length,
    taskLength: await Task.countDocuments(),
    data: {
      tasks,
    },
  });
});

const getTaskById = catchAsync(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    taskLength: await Task.countDocuments(),
    data: {
      task,
    },
  });
});

const updateTask = catchAsync(async (req, res, next) => {
  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json({
    status: 'success',
    taskLength: await Task.countDocuments(),
    data: {
      task: updatedTask,
    },
  });
});

const deleteTask = catchAsync(async (req, res, next) => {
  await Task.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

const getTaskStat = catchAsync(async (req, res, next) => {
  const stat = await Task.aggregate([
    {
      $group: {
        _id: '$status',
        taskNum: { $sum: 1 },
      },
    },
    {
      $addFields: { taskStatus: '$_id' },
    },
    {
      $project: { _id: 0 },
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      totalTask: await Task.countDocuments(),
      stat,
    },
  });
});

module.exports = {
  createTask,
  getAllTask,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStat,
};
