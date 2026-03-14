import { Divider } from "@mui/material";

const getCartItems = (cart: any) => {
  if (Array.isArray(cart?.items)) return cart.items;
  if (Array.isArray(cart?.cartItems)) return cart.cartItems;
  return [];
};

export const PricingCard = ({ cart }: any) => {
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
  const productDiscount = Math.max(0, totalMrpPrice - totalSellingPrice);

  return (
    <div className="rounded-md border border-gray-300">
      <div className="space-y-3 p-5">
        <div className="flex items-center justify-between">
          <span>Price ({totalItems} item{totalItems === 1 ? "" : "s"})</span>
          <span>Rs. {totalMrpPrice}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Product Discount</span>
          <span className="text-teal-600">-Rs. {productDiscount}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Delivery</span>
          <span>{items.length ? "Free" : "Rs. 0"}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Platform fee</span>
          <span>Rs. 0</span>
        </div>
        <Divider />
        <div className="flex items-center justify-between border-t border-gray-300 pt-3">
          <strong>Total Amount</strong>
          <span className="font-semibold text-teal-700">Rs. {totalSellingPrice}</span>
        </div>
        <p className="text-sm text-teal-700">
          You save Rs. {productDiscount} on this order.
        </p>
      </div>
    </div>
  );
};
