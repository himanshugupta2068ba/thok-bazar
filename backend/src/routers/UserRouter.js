const express = require('express');
const router = express.Router();
const sellerMiddleware = require('../middlewares/sellerAuthMiddleware');
const UserController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/signup', UserController.createUser);
router.post('/signin', UserController.signin);
router.post('/send-login-otp', UserController.sendLoginOtp);
router.post('/send-signup-otp', UserController.sendLoginOtp);
router.get('/profile', authMiddleware, UserController.getUserProfile);
module.exports = router;