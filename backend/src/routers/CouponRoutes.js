const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const adminAuthMiddleware = require('../middlewares/adminAuthMiddleware');

router.get('/', couponController.getCoupons);
router.post('/', adminAuthMiddleware, couponController.createCoupon);
router.put('/:id', adminAuthMiddleware, couponController.updateCoupon);
router.patch('/:id/status', adminAuthMiddleware, couponController.updateCouponStatus);
router.delete('/:id', adminAuthMiddleware, couponController.deleteCoupon);
router.post('/apply', couponController.applyCoupon);

module.exports = router;
