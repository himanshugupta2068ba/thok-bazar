const test = require('node:test');
const assert = require('node:assert/strict');
const { buildCartPricing } = require('../src/util/checkoutPricing');
const { normalizePaymentMethod, isCashOnDelivery } = require('../src/util/paymentMethod');

test('empty carts have no fees or payable amount', () => {
    assert.deepEqual(buildCartPricing(), {
        totalMrpPrice: 0, totalSellingPrice: 0, totalItems: 0, discount: 0,
        productDiscountAmount: 0, platformFee: 0, shippingFee: 0, orderValue: 0,
        payableAmount: 0, couponCode: null, couponDiscountAmount: 0,
        couponDiscountPercentage: 0, appliedCoupon: null,
    });
});

test('checkout totals include fees and cap coupon discount at order value', () => {
    const pricing = buildCartPricing({
        cartItems: [{ mrpPrice: 1200, sellingPrice: 1000, quantity: 2 }],
        couponResult: { discountAmount: 5000, coupon: { code: 'SAVE', discount: 10 } },
    });
    assert.equal(pricing.orderValue, 1119);
    assert.equal(pricing.payableAmount, 0);
    assert.equal(pricing.couponDiscountAmount, 1119);
});

test('payment methods normalize consistently', () => {
    assert.equal(normalizePaymentMethod('cash_on_delivery'), 'COD');
    assert.equal(normalizePaymentMethod('razorpay'), 'RAZORPAY');
    assert.equal(isCashOnDelivery('COD'), true);
});
