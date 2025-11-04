const express = require('express');
const router = express.Router();
const SellerController = require('../controllers/sellerController');

router.get('/profile', SellerController.getSellerProfile);
router.post('/', SellerController.createSeller);
router.get('/', SellerController.getAllSeller);
router.put('/', SellerController.updateSeller);

router.post("/verify/login-otp", SellerController.verifyLoginOtp);

module.exports = router;