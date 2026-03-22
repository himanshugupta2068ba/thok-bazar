const express = require('express');
const router = express.Router();
const SellerController = require('../controllers/sellerController');
const sellerMiddleware = require('../middlewares/sellerAuthMiddleware');
const adminAuthMiddleware = require('../middlewares/adminAuthMiddleware');

router.get('/profile',sellerMiddleware, SellerController.getSellerProfile);
router.post('/', SellerController.createSeller);
router.get('/', adminAuthMiddleware, SellerController.getAllSeller);
router.put('/', sellerMiddleware,SellerController.updateSeller);
router.post('/send/login-otp', SellerController.sendLoginOtp);
router.post('/verify/login-otp', SellerController.verifyLoginOtp);

module.exports = router;
