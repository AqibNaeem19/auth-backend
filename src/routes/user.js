const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');
const verifyToken = require('../Middleware/auth');

// User Signup route
router.post('/signup', userController.signup);

// User login route
router.post('/login', userController.login);

// User request for password reset
router.post('/reset-request', userController.passwordResetRequest );

// Checks the reset request code and updates the password
router.post('/reset-password', userController.resetPassword);


module.exports = router;