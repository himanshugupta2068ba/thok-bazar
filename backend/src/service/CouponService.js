const Coupon = require('../models/Coupon');

class CouponService {
  normalizeCouponDates(couponData = {}) {
    const payload = { ...couponData };

    if (payload.startDate) {
      const startDate = new Date(payload.startDate);
      startDate.setHours(0, 0, 0, 0);
      payload.startDate = startDate;
    }

    if (payload.endDate) {
      const endDate = new Date(payload.endDate);
      endDate.setHours(23, 59, 59, 999);
      payload.endDate = endDate;
    }

    return payload;
  }

  async getCoupons(filters = {}) {
    const query = {};
    const normalizedStatus = String(filters?.status || "").toUpperCase().trim();
    const activeOnly = String(filters?.activeOnly || "").toLowerCase() === "true";

    if (normalizedStatus) {
      query.status = normalizedStatus;
    }

    if (activeOnly) {
      const now = new Date();
      query.status = "ACTIVE";
      query.startDate = { $lte: now };
      query.endDate = { $gte: now };
    }

    return await Coupon.find(query).sort({ createdAt: -1 });
  }

  async createCoupon(couponData) {
    const payload = {
      ...this.normalizeCouponDates(couponData),
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

    if (new Date(payload.startDate) > new Date(payload.endDate)) {
      throw new Error('End date must be after start date');
    }

    return await Coupon.create(payload);
  }

  async updateCoupon(id, updates) {
    const existingCoupon = await Coupon.findById(id);
    if (!existingCoupon) {
      throw new Error('Coupon not found');
    }

    const payload = this.normalizeCouponDates({ ...updates });

    if (payload.code) {
      payload.code = String(payload.code).toUpperCase().trim();
    }
    if (payload.discount !== undefined) {
      payload.discount = Number(payload.discount);
    }
    if (payload.minOrderAmount !== undefined) {
      payload.minOrderAmount = Number(payload.minOrderAmount);
    }
    const nextStartDate = payload.startDate || existingCoupon.startDate;
    const nextEndDate = payload.endDate || existingCoupon.endDate;
    if (new Date(nextStartDate) > new Date(nextEndDate)) {
      throw new Error('End date must be after start date');
    }

    const updatedCoupon = await Coupon.findByIdAndUpdate(
      id,
      { $set: payload },
      { new: true, runValidators: true },
    );

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

  async validateCoupon(code, orderValue) {
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
      orderValue: value,
      discountAmount,
      finalAmount,
    };
  }

  async applyCoupon(code, orderValue) {
    const result = await this.validateCoupon(code, orderValue);

    return {
      coupon: result.coupon,
      cart: {
        couponCode: result.coupon.code,
        discount: result.coupon.discount,
      },
      orderValue: result.orderValue,
      discountAmount: result.discountAmount,
      finalAmount: result.finalAmount,
    };
  }
}

module.exports = new CouponService();
