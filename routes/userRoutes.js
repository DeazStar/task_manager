const express = require('express');
const authController = require('../controllers/authController');
const { getUsers } = require('../controllers/userController');

const router = express.Router();

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);

router
  .route('/')
  .get(authController.protect, authController.restrictTo('admin'), getUsers);

module.exports = router;
