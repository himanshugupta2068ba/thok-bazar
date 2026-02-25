const Coupon = require('../models/Coupon');

class CouponService {
  async getCoupons() {
    return await Coupon.find().sort({ createdAt: -1 });
  }

  async createCoupon(couponData) {
    const payload = {
      ...couponData,
      code: String(couponData.code || '').toUpperCase().trim(),
      discount: Number(couponData.discount),
      minOrderAmount: Number(couponData.minOrderAmount),
    };

    if (!payload.code || !payload.startDate || !payload.endDate) {
      throw new Error('Missing required coupon fields');
    }

    const exists = await Coupon.findOne({ code: payload.code });
    if (exists) {
      throw new Error('Coupon already exists');
    }

    return await Coupon.create(payload);
  }

  async updateCoupon(id, updates) {
    const payload = { ...updates };

    if (payload.code) {
      payload.code = String(payload.code).toUpperCase().trim();
    }
    if (payload.discount !== undefined) {
      payload.discount = Number(payload.discount);
    }
    if (payload.minOrderAmount !== undefined) {
      payload.minOrderAmount = Number(payload.minOrderAmount);
    }

    const updatedCoupon = await Coupon.findByIdAndUpdate(
      id,
      { $set: payload },
      { new: true, runValidators: true },
    );

    if (!updatedCoupon) {
      throw new Error('Coupon not found');
    }

    return updatedCoupon;
  }

  async updateCouponStatus(id, status) {
    const normalizedStatus = String(status || '').toUpperCase();

    if (!['ACTIVE', 'INACTIVE'].includes(normalizedStatus)) {
      throw new Error('Invalid coupon status');
    }

    const updatedCoupon = await Coupon.findByIdAndUpdate(
      id,
      { $set: { status: normalizedStatus } },
      { new: true },
    );

    if (!updatedCoupon) {
      throw new Error('Coupon not found');
    }

    return updatedCoupon;
  }

  async deleteCoupon(id) {
    const deletedCoupon = await Coupon.findByIdAndDelete(id);
    if (!deletedCoupon) {
      throw new Error('Coupon not found');
    }
    return deletedCoupon;
  }

  async applyCoupon(code, orderValue) {
    const normalizedCode = String(code || '').toUpperCase().trim();
    const value = Number(orderValue);

    if (!normalizedCode) {
      throw new Error('Coupon code is required');
    }

    if (Number.isNaN(value) || value <= 0) {
      throw new Error('Invalid order value');
    }

    const coupon = await Coupon.findOne({ code: normalizedCode });
    if (!coupon) {
      throw new Error('Invalid coupon code');
    }

    const now = new Date();
    if (coupon.status !== 'ACTIVE') {
      throw new Error('Coupon is inactive');
    }
    if (now < coupon.startDate || now > coupon.endDate) {
      throw new Error('Coupon is not valid at this time');
    }
    if (value < coupon.minOrderAmount) {
      throw new Error('Minimum order amount not met for this coupon');
    }

    const discountAmount = Number(((value * coupon.discount) / 100).toFixed(2));
    const finalAmount = Number(Math.max(0, value - discountAmount).toFixed(2));

    return {
      coupon,
      cart: {
        couponCode: coupon.code,
        discount: coupon.discount,
      },
      orderValue: value,
      discountAmount,
      finalAmount,
    };
  }
}

module.exports = new CouponService();
