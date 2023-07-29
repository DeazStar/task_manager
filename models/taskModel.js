const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'task must have a name'],
  },
  description: {
    type: String,
    required: [true, 'task must have a description'],
  },
  dueDate: {
    type: Date,
    required: [true, 'task muse have a due date'],
    validator: (date) => new Date(date).getTime() >= Date.now().getTime(),
  },
  priority: {
    type: Number,
    default: 0,
    validate: {
      validator: (num) => num >= 0,
      message: 'Priority must be greater or equal to zero',
    },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  status: {
    type: String,
    default: 'pending',
  },
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
