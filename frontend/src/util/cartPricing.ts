const PLATFORM_FEE = 20;
const SHIPPING_FEE = 99;

export const getCartItems = (cart: any) => {
  if (Array.isArray(cart?.items)) return cart.items;
  if (Array.isArray(cart?.cartItems)) return cart.cartItems;
  return [];
};

export const getCartPricing = (cart: any) => {
  const items = getCartItems(cart);
  const totalMrpPrice =
    Number(cart?.totalMrpPrice) ||
    items.reduce((total: number, item: any) => total + Number(item?.mrpPrice || 0), 0);
  const totalSellingPrice =
    Number(cart?.totalSellingPrice) ||
    items.reduce((total: number, item: any) => total + Number(item?.sellingPrice || 0), 0);
  const totalItems =
    Number(cart?.totalItems) ||
    items.reduce((total: number, item: any) => total + Number(item?.quantity || 0), 0);
  const productDiscountAmount =
    Number(cart?.productDiscountAmount) ||
    Math.max(0, totalMrpPrice - totalSellingPrice);
  const platformFee = Number(cart?.platformFee ?? (items.length ? PLATFORM_FEE : 0));
  const shippingFee = Number(cart?.shippingFee ?? (items.length ? SHIPPING_FEE : 0));
  const orderValue = Number(cart?.orderValue ?? totalSellingPrice + platformFee + shippingFee);
  const couponDiscountAmount = Number(cart?.couponDiscountAmount || 0);
  const payableAmount = Number(
    cart?.payableAmount ?? Math.max(0, orderValue - couponDiscountAmount),
  );

  return {
    items,
    totalMrpPrice,
    totalSellingPrice,
    totalItems,
    productDiscountAmount,
    platformFee,
    shippingFee,
    orderValue,
    couponDiscountAmount,
    payableAmount,
    totalSavings: productDiscountAmount + couponDiscountAmount,
    couponCode: cart?.couponCode || cart?.appliedCoupon?.code || null,
    appliedCoupon: cart?.appliedCoupon || null,
  };
};
