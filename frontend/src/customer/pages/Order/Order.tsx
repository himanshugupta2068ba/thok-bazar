import { useEffect } from "react";
import { useNavigate } from "react-router";
import { fetchUserOrders } from "../../../Redux Toolkit/featurs/coustomer/orderSlice";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/store";
import { OrderItemCart } from "./OrderCart";

export const Order = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { order } = useAppSelector((state) => state);

    useEffect(() => {
        dispatch(fetchUserOrders(null));
    }, [dispatch]);

    const orders = Array.isArray(order.orders) ? order.orders : [];

    return (
        <div className="text-sm min-h-screen">
            <div className="pb-5">
                <h1 className="font-semibold">All Orders</h1>
                <p>From anytime</p>
            </div>

            {order.loading ? (
                <p className="text-gray-500">Loading orders...</p>
            ) : null}

            {!order.loading && !orders.length ? (
                <p className="text-gray-500">No orders found.</p>
            ) : null}

            <div className="space-y-2">
                {orders.map((orderItem: any) => (
                    <div
                        key={orderItem?._id}
                        onClick={() => navigate(`/customer/profile/orders/${orderItem?._id}`)}
                    >
                        <OrderItemCart order={orderItem} />
                    </div>
                ))}
            </div>
        </div>
    );
};