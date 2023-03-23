const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');
const auth = require('../Middleware/auth');

// User Signup route
router.post('/signup', userController.signup);

// User login route
router.post('/login', userController.login);

// User homepage route
router.post('/homepage', auth, userController.homePage);


module.exports = router;