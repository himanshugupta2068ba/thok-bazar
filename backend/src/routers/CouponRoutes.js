const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');

router.get('/', couponController.getCoupons);
router.post('/', couponController.createCoupon);
router.put('/:id', couponController.updateCoupon);
router.patch('/:id/status', couponController.updateCouponStatus);
router.delete('/:id', couponController.deleteCoupon);
router.post('/apply', couponController.applyCoupon);

module.exports = router;
