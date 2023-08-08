const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);

router.route('/forgetPassword').post(authController.forgetPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);

router
  .route('/updateCurrentUser')
  .patch(authController.protect, userController.updateCurrentUser);

router
  .route('/deleteCurrentUser')
  .delete(authController.protect, userController.deleteCurrentUser);

router
  .route('/updateCurrentPassword')
  .post(authController.protect, userController.updateCurrentPassword);

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    userController.getUsers,
  );

router
  .route('/')
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    userController.createUser,
  );

router
  .route('/:id')
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    userController.updateUser,
  )
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    userController.getUserById,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    userController.deleteUser,
  );

module.exports = router;
