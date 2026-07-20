const express = require('express');
const router = express.Router();
const SellerController = require('../controllers/sellerController');
const sellerMiddleware = require('../middlewares/sellerAuthMiddleware');
const adminAuthMiddleware = require('../middlewares/adminAuthMiddleware');
const rateLimit = require('../middlewares/rateLimit');
const authLimit = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });
const otpLimit = rateLimit({ windowMs: 15 * 60 * 1000, max: 5 });

router.get('/profile', sellerMiddleware, SellerController.getSellerProfile);
router.post('/', authLimit, SellerController.createSeller);
router.post('/signin', authLimit, SellerController.signin);
router.post('/google-signin', authLimit, SellerController.googleSignin);
router.get('/', adminAuthMiddleware, SellerController.getAllSeller);
router.put('/', sellerMiddleware, SellerController.updateSeller);
router.post('/send/login-otp', otpLimit, SellerController.sendLoginOtp);
router.post('/verify/login-otp', otpLimit, SellerController.verifyLoginOtp);

module.exports = router;
