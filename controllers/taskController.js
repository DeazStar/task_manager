const Task = require('../models/taskModel');
const Features = require('../utils/Features');

const createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);

    res.status(201).json({
      status: 'success',
      taskLength: await Task.countDocuments(),
      data: {
        task,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: `bad request ${err}`,
    });
  }
};

const getAllTask = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: `bad request ${err.message}`,
    });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      taskLength: await Task.countDocuments(),
      data: {
        task,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: `resource not found ${err}`,
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body);

    res.status(200).json({
      status: 'success',
      taskLength: await Task.countDocuments(),
      data: {
        task: updatedTask,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: `bad request ${err}`,
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: `resource not found ${err}`,
    });
  }
};

module.exports = {
  createTask,
  getAllTask,
  getTaskById,
  updateTask,
  deleteTask,
};
