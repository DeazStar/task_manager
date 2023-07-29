const Task = require('../models/taskModel');

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
    const tasks = await Task.find();

    res.status(200).json({
      status: 'success',
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

module.exports = {
  createTask,
  getAllTask,
};
