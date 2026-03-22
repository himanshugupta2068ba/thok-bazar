const calculateDiscountPercentage = require("./discountCalculator");

const PLATFORM_FEE = 20;
const SHIPPING_FEE = 99;

const roundCurrency = (value) => Number(Number(value || 0).toFixed(2));

const getCheckoutFees = (cartItems = []) => {
    const hasItems = Array.isArray(cartItems) && cartItems.length > 0;

    return {
        platformFee: hasItems ? PLATFORM_FEE : 0,
        shippingFee: hasItems ? SHIPPING_FEE : 0,
    };
};

const buildAppliedCoupon = (couponResult) => {
    if (!couponResult?.coupon) {
        return null;
    }

    const coupon = couponResult.coupon;

    return {
        _id: coupon._id,
        code: coupon.code,
        discount: Number(coupon.discount || 0),
        minOrderAmount: Number(coupon.minOrderAmount || 0),
        startDate: coupon.startDate,
        endDate: coupon.endDate,
        status: coupon.status,
    };
};

const buildCartPricing = ({ cartItems = [], couponResult = null } = {}) => {
    const items = Array.isArray(cartItems) ? cartItems : [];
    const totalMrpPrice = roundCurrency(
        items.reduce((total, cartItem) => total + Number(cartItem?.mrpPrice || 0), 0),
    );
    const totalSellingPrice = roundCurrency(
        items.reduce((total, cartItem) => total + Number(cartItem?.sellingPrice || 0), 0),
    );
    const totalItems = items.reduce((total, cartItem) => total + Number(cartItem?.quantity || 0), 0);
    const productDiscountAmount = roundCurrency(Math.max(0, totalMrpPrice - totalSellingPrice));
    const { platformFee, shippingFee } = getCheckoutFees(items);
    const orderValue = roundCurrency(totalSellingPrice + platformFee + shippingFee);
    const couponDiscountAmount = roundCurrency(
        Math.min(orderValue, Number(couponResult?.discountAmount || 0)),
    );
    const payableAmount = roundCurrency(Math.max(0, orderValue - couponDiscountAmount));
    const appliedCoupon = buildAppliedCoupon(couponResult);

    return {
        totalMrpPrice,
        totalSellingPrice,
        totalItems,
        discount: calculateDiscountPercentage(totalMrpPrice, totalSellingPrice),
        productDiscountAmount,
        platformFee,
        shippingFee,
        orderValue,
        payableAmount,
        couponCode: appliedCoupon?.code || null,
        couponDiscountAmount,
        couponDiscountPercentage: Number(appliedCoupon?.discount || 0),
        appliedCoupon,
    };
};

module.exports = {
    PLATFORM_FEE,
    SHIPPING_FEE,
    buildCartPricing,
    roundCurrency,
};
