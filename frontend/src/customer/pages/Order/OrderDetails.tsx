import { Box, Button, Divider } from "@mui/material";
import { useEffect } from "react";
import { Payment } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router";
import { cancelOrder, deleteOrder, fetchOrderDetails } from "../../../Redux Toolkit/featurs/coustomer/orderSlice";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/store";
import { OrderStepper } from "./OrderStepper";

export const OrderDetails = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { order, auth } = useAppSelector((state: any) => state);

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
  const productTotal = Number(orderDetails?.totalSellingPrice || 0) - Number(orderDetails?.platformFee || 0) - Number(orderDetails?.shippingFee || 0);
  const totalAmount = Number(orderDetails?.totalSellingPrice || 0);
  const savedAmount = Math.max(0, Number(orderDetails?.totalMrpPrice || 0) - productTotal);

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
      <section className="flex flex-col gap-5 justify-center items-center">
        <img className="w-32" src="https://cdn-icons-png.flaticon.com/512/190/190411.png" alt="order placed" />
        <div className="text-sm space-y-1 text-center">
          <h1 className="font-bold text-lg">Order Tracking</h1>
          <p>Track your order progress and delivery updates.</p>
        </div>
      </section>

      <section className="border border-gray-200 p-5">
        <OrderStepper currentStatus={status} isCancelled={isCancelled} />
      </section>

      <section className="border border-gray-200 p-5">
        <h1 className="font-bold pb-3">Delivery Address</h1>
        <div className="text-sm space-y-2">
          <div className="flex gap-5 font-medium">
            <p>{address?.name || "-"}</p>
            <Divider orientation="vertical" flexItem />
            <p>{address?.mobile || "-"}</p>
          </div>
          <p>{[address?.address, address?.locality, address?.city, address?.state, address?.pincode].filter(Boolean).join(", ") || "-"}</p>
        </div>
      </section>

      <section className="border border-gray-200 p-5">
        <div className="flex gap-5 font-medium">
          <div className="space-y-1">
            <p className="font-semibold">Total item Price</p>
            <p className="pb-3">You saved <span className="text-green-500">Rs. {savedAmount}</span></p>
          </div>
          <p className="text-lg font-bold ml-auto">Rs. {totalAmount}</p>
        </div>

        <div className="px-5 py-3 border-t border-gray-200 bg-teal-50 space-y-2">
          <div className="flex justify-between">
            <Payment className="text-teal-500" />
            <p>{auth.user?.paymentMethod || "Online Payment"}</p>
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