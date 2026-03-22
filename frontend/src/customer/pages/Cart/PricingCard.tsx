import { Divider } from "@mui/material";
import { getCartPricing } from "../../../util/cartPricing";

export const PricingCard = ({ cart }: any) => {
  const {
    totalMrpPrice,
    totalItems,
    productDiscountAmount,
    shippingFee,
    platformFee,
    couponDiscountAmount,
    payableAmount,
    couponCode,
  } = getCartPricing(cart);

  return (
    <div className="rounded-md border border-gray-300">
      <div className="space-y-3 p-5">
        {couponCode ? (
          <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
            Coupon applied: {couponCode}
          </div>
        ) : null}
        <div className="flex items-center justify-between">
          <span>Price ({totalItems} item{totalItems === 1 ? "" : "s"})</span>
          <span>Rs. {totalMrpPrice}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Product Discount</span>
          <span className="text-teal-600">-Rs. {productDiscountAmount}</span>
        </div>
        {couponDiscountAmount > 0 ? (
          <div className="flex items-center justify-between">
            <span>Coupon Discount</span>
            <span className="text-emerald-600">-Rs. {couponDiscountAmount}</span>
          </div>
        ) : null}
        <div className="flex items-center justify-between">
          <span>Delivery</span>
          <span>Rs. {shippingFee}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Platform fee</span>
          <span>Rs. {platformFee}</span>
        </div>
        <Divider />
        <div className="flex items-center justify-between border-t border-gray-300 pt-3">
          <strong>Total Amount</strong>
          <span className="font-semibold text-teal-700">Rs. {payableAmount}</span>
        </div>
        <p className="text-sm text-teal-700">
          You save Rs. {productDiscountAmount + couponDiscountAmount} on this order.
        </p>
      </div>
    </div>
  );
};
