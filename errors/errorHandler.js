const AppError = require('./AppError');

const sendDevError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    stack: err.stack,
    message: err.message,
  });
};

const sendProductionError = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.log(err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
      error: err,
    });
  }
};

const handleValidationError = (err) => {
  const statusCode = 400;
  let message = Object.values(err.errors).map((element) => element.message);

  message = message.join('. ');
  return new AppError(message, statusCode);
};

const handleCastError = (err) => {
  const statusCode = 404;
  const message = `there is no id with the value of ${err.value}`;

  return new AppError(message, statusCode);
};

const handleDuplicateError = (err) => {
  const statusCode = 400;
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate filed value: ${value}. Please use another Value!`;

  return new AppError(message, statusCode);
};

module.exports = async (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  console.log(process.env.NODE_ENV);
  if (process.env.NODE_ENV === 'development') {
    sendDevError(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.create(
      Object.getPrototypeOf(err),
      Object.getOwnPropertyDescriptors(err),
    );

    if (err.name === 'ValidationError') error = handleValidationError(err);

    if (err.name === 'CastError') error = handleCastError(err);

    if (err.code === 11000) error = handleDuplicateError(err);

    sendProductionError(error, res);
  }
};
