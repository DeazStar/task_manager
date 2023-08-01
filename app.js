const express = require('express');
const morgan = require('morgan');
const taskRouter = require('./routes/taskRoutes');
const AppError = require('./errors/AppError');
const generalErrorHandler = require('./errors/errorHandler');

const app = express();

app.use(express.json());

app.use(morgan('dev'));

app.use('/api/v1/task', taskRouter);

app.all('*', (req, res, next) => {
  const message = `Can't find ${req.originalUrl}.`;
  const statusCode = 404;
  next(new AppError(message, statusCode));
});

app.use(generalErrorHandler);
module.exports = app;
