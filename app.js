const express = require('express');
const taskRouter = require('./routes/taskRoutes');

const app = express();

app.use(express.json());

app.use('/api/v1/task', taskRouter);

module.exports = app;
