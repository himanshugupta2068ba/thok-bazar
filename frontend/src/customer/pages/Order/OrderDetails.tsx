import { Box, Button, Divider } from "@mui/material";
import { useEffect } from "react";
import { OpenInNew, Payment } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router";
import { cancelOrder, deleteOrder, fetchOrderDetails } from "../../../Redux Toolkit/featurs/coustomer/orderSlice";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/store";
import { OrderStepper } from "./OrderStepper";
import {
  formatPaymentMethodLabel,
  getOrderStatusLabel,
  getProductDetailsPath,
} from "./orderViewUtils";

export const OrderDetails = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { order } = useAppSelector((state: any) => state);

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderDetails(orderId));
    }
  }, [dispatch, orderId]);

  const orderDetails: any = order.orderDetails;
  const address = orderDetails?.shippingAddress;
  const status = orderDetails?.orderStatus;
  const isCancelled = status === "CANCELLED";
  const isDelivered = status === "DELIVERED";
  const orderItems = Array.isArray(orderDetails?.orderItems) ? orderDetails.orderItems : [];
  const derivedItemTotal = orderItems.reduce(
    (total: number, item: any) => total + Number(item?.sellingPrice || 0),
    0,
  );
  const productTotal = Number(orderDetails?.itemTotal ?? derivedItemTotal);
  const totalAmount = Number(orderDetails?.totalSellingPrice || 0);
  const productDiscountAmount = Number(orderDetails?.discount || 0);
  const couponDiscountAmount = Number(orderDetails?.couponDiscountAmount || 0);
  const savedAmount = Math.max(0, productDiscountAmount + couponDiscountAmount);

  const handleCancelOrder = async () => {
    if (!orderId || isCancelled || isDelivered) return;
    await dispatch(cancelOrder(orderId));
    await dispatch(fetchOrderDetails(orderId));
  };

  const handleDeleteOrder = async () => {
    if (!orderId || !isCancelled) return;
    await dispatch(deleteOrder(orderId));
    navigate("/customer/profile/orders");
  };

  if (order.loading && !orderDetails) {
    return <p className="text-gray-500">Loading order details...</p>;
  }

  if (!orderDetails) {
    return <p className="text-gray-500">Order details not found.</p>;
  }

  return (
    <Box className="space-y-5">
      <section className="flex flex-col items-center justify-center gap-5">
        <img className="w-32" src="https://cdn-icons-png.flaticon.com/512/190/190411.png" alt="order placed" />
        <div className="space-y-1 text-center text-sm">
          <h1 className="text-lg font-bold">Order Tracking</h1>
          <p>Track your order progress and delivery updates.</p>
        </div>
      </section>

      <section className="border border-gray-200 p-5">
        <OrderStepper currentStatus={status} isCancelled={isCancelled} />
      </section>

      <section className="border border-gray-200 p-5">
        <h1 className="pb-3 font-bold">Delivery Address</h1>
        <div className="space-y-2 text-sm">
          <div className="flex gap-5 font-medium">
            <p>{address?.name || "-"}</p>
            <Divider orientation="vertical" flexItem />
            <p>{address?.mobile || "-"}</p>
          </div>
          <p>{[address?.address, address?.locality, address?.city, address?.state, address?.pincode].filter(Boolean).join(", ") || "-"}</p>
        </div>
      </section>

      <section className="border border-gray-200 p-5">
        <h1 className="pb-4 font-bold">Items In This Order</h1>
        <div className="space-y-3">
          {orderItems.map((item: any) => {
            const product = item?.product;
            const productPath = getProductDetailsPath(product);
            const image =
              product?.images?.[0] || "https://m.media-amazon.com/images/I/61jLi2nQJDL._SX679_.jpg";

            return (
              <div
                key={item?._id || product?._id}
                className="flex flex-col gap-4 rounded-md border border-gray-200 p-4 md:flex-row md:items-center"
              >
                <img className="h-24 w-24 rounded-md object-cover" src={image} alt={product?.title || "product"} />
                <div className="flex-1 space-y-1">
                  <h2 className="font-semibold">{product?.title || "Product"}</h2>
                  <p className="text-sm text-gray-600">
                    Qty: {item?.quantity || 0} | Size: {item?.size || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Price: Rs. {item?.sellingPrice || 0}
                  </p>
                </div>
                <Button
                  variant="outlined"
                  startIcon={<OpenInNew />}
                  disabled={!productPath}
                  onClick={() => {
                    if (productPath) {
                      navigate(productPath);
                    }
                  }}
                >
                  View Product
                </Button>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border border-gray-200 p-5">
        <div className="flex gap-5 font-medium">
          <div className="space-y-1">
            <p className="font-semibold">Total item Price</p>
            <p className="pb-3">You saved <span className="text-green-500">Rs. {savedAmount}</span></p>
          </div>
          <p className="ml-auto text-lg font-bold">Rs. {totalAmount}</p>
        </div>

        <div className="space-y-2 border-t border-gray-200 bg-teal-50 px-5 py-3">
          <div className="flex justify-between text-xs text-gray-600">
            <span>Items Total</span>
            <span>Rs. {productTotal}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>Product Discount</span>
            <span>-Rs. {productDiscountAmount}</span>
          </div>
          {couponDiscountAmount > 0 ? (
            <div className="flex justify-between text-xs text-gray-600">
              <span>Coupon {orderDetails?.couponCode ? `(${orderDetails.couponCode})` : ""}</span>
              <span>-Rs. {couponDiscountAmount}</span>
            </div>
          ) : null}
          <div className="flex justify-between">
            <Payment className="text-teal-500" />
            <p>{formatPaymentMethodLabel(orderDetails?.paymentMethod)}</p>
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>Payment Status</span>
            <span>{getOrderStatusLabel(orderDetails?.paymentStatus || "PENDING")}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>Platform Fee</span>
            <span>Rs. {orderDetails?.platformFee || 0}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>Shipping Fee</span>
            <span>Rs. {orderDetails?.shippingFee || 0}</span>
          </div>
        </div>

        <Divider />

        <div className="p-10">
          {isCancelled ? (
            <Button
              variant="outlined"
              color="error"
              fullWidth
              onClick={handleDeleteOrder}
              disabled={order.loading}
            >
              Delete Order
            </Button>
          ) : (
            <Button
              variant="outlined"
              color="warning"
              fullWidth
              onClick={handleCancelOrder}
              disabled={isDelivered || order.loading}
            >
              {isDelivered ? "Delivered" : "Cancel Order"}
            </Button>
          )}
        </div>
      </section>
    </Box>
  );
};
