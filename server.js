const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');
const app = require('./app');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED EXCEPTION! * shutting down ...');
  process.exit(1);
});

mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log('Database connected');
  })
  .catch((err) => {
    console.log(err);
  });
const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! * Shutting down ...');
  server.close(() => {
    process.exit(1);
  });
});
