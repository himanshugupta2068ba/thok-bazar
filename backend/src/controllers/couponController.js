const CouponService = require('../service/CouponService');

class CouponController {
  async getCoupons(req, res) {
    try {
      const coupons = await CouponService.getCoupons();
      return res.status(200).json(coupons);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async createCoupon(req, res) {
    try {
      const coupon = await CouponService.createCoupon(req.body);
      return res.status(201).json(coupon);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async updateCoupon(req, res) {
    try {
      const coupon = await CouponService.updateCoupon(req.params.id, req.body);
      return res.status(200).json(coupon);
    } catch (error) {
      const statusCode = error.message === 'Coupon not found' ? 404 : 400;
      return res.status(statusCode).json({ message: error.message });
    }
  }

  async updateCouponStatus(req, res) {
    try {
      const coupon = await CouponService.updateCouponStatus(req.params.id, req.body.status);
      return res.status(200).json(coupon);
    } catch (error) {
      const statusCode = error.message === 'Coupon not found' ? 404 : 400;
      return res.status(statusCode).json({ message: error.message });
    }
  }

  async deleteCoupon(req, res) {
    try {
      const deletedCoupon = await CouponService.deleteCoupon(req.params.id);
      return res.status(200).json(deletedCoupon);
    } catch (error) {
      const statusCode = error.message === 'Coupon not found' ? 404 : 400;
      return res.status(statusCode).json({ message: error.message });
    }
  }

  async applyCoupon(req, res) {
    try {
      const { code, orderValue } = req.body;
      const result = await CouponService.applyCoupon(code, orderValue);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new CouponController();
