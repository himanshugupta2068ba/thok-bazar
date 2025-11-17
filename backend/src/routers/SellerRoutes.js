const express = require('express');
const router = express.Router();
const SellerController = require('../controllers/sellerController');
const sellerMiddleware = require('../middlewares/sellerAuthMiddleware');

router.get('/profile',sellerMiddleware, SellerController.getSellerProfile);
router.post('/', SellerController.createSeller);
router.get('/', SellerController.getAllSeller);
router.put('/', sellerMiddleware,SellerController.updateSeller);
router.post('/send/login-otp', SellerController.sendLoginOtp);
router.post("/verify/login-otp",sellerMiddleware, SellerController.verifyLoginOtp);

module.exports = router;