const express = require('express');
const authController = require('../controllers/authController');
const { getUsers } = require('../controllers/userController');

const router = express.Router();

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);

router.route('/forgetPassword').post(authController.forgetPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);

router
  .route('/')
  .get(authController.protect, authController.restrictTo('admin'), getUsers);

module.exports = router;
