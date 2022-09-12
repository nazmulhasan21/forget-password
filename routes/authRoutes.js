const express = require('express');
const router = express.Router();

const { signupValidate } = require('../middleware/inputValidation');
const authController = require('../controllers/authController');
const {
  sendForgetPasswordVerificationLink,
  resatPassword,
} = require('../controllers/forgetPassword');

router.post('/signup', signupValidate, authController.signup);

router.post('/login', authController.login);
router.post('/forget-password', sendForgetPasswordVerificationLink);
router.post('/reset-password', resatPassword);

module.exports = router;
