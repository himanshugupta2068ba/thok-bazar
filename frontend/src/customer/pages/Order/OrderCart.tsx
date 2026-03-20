import { ElectricBolt, OpenInNew } from "@mui/icons-material"
import { Avatar, Button } from "@mui/material"
import type { MouseEvent } from "react";
import { useNavigate } from "react-router";
import {
    formatPaymentMethodLabel,
    getOrderDisplayDate,
    getOrderStatusLabel,
    getProductDetailsPath,
} from "./orderViewUtils";

export const OrderItemCart = ({ order, onOpenOrder }: any) => {
    const navigate = useNavigate();
    const orderItems = Array.isArray(order?.orderItems) ? order.orderItems : [];
    const previewItems = orderItems.slice(0, 2);
    const extraItems = Math.max(orderItems.length - previewItems.length, 0);
    const sellerName =
        order?.seller?.businessDetails?.businessName ||
        order?.seller?.sellerName ||
        "Seller";
    const handleOpenProduct = (event: MouseEvent<HTMLButtonElement>, product: any) => {
        event.stopPropagation();
        const productPath = getProductDetailsPath(product);
        if (!productPath) return;
        navigate(productPath);
    };

    return (
        <div
            className="text-sm bg-white p-5 space-y-4 border border-gray-300 rounded-md cursor-pointer"
            onClick={onOpenOrder}
        >
            <div className="flex items-center gap-3">
                <div>
                    <Avatar sizes="small" sx={{ bgcolor: "#00927c" }}>
                        <ElectricBolt />
                    </Avatar>
                </div>
                <div>
                    <h1 className="font-bold text-teal-600">{getOrderStatusLabel(order?.orderStatus)}</h1>
                    <p>Ordered on {getOrderDisplayDate(order?.createdAt)}</p>
                    <p className="text-xs text-gray-500">
                        Payment: {formatPaymentMethodLabel(order?.paymentMethod)}
                    </p>
                </div>
            </div>
            <div className="space-y-3">
                {previewItems.map((item: any) => {
                    const product = item?.product;
                    const image =
                        product?.images?.[0] || "https://m.media-amazon.com/images/I/61jLi2nQJDL._SX679_.jpg";
                    const title = product?.title || "Order item";

                    return (
                        <div
                            key={item?._id || product?._id}
                            className="p-5 bg-teal-50 flex gap-3 items-center"
                        >
                            <div>
                                <img className="w-17.5" src={image} alt="product image" />
                            </div>
                            <div className="w-full space-y-2">
                                <h1 className="font-bold">{sellerName}</h1>
                                <p>{title}</p>
                                <p><strong>size :</strong> {item?.size || "N/A"}</p>
                                <p><strong>qty :</strong> {item?.quantity || 0}</p>
                            </div>
                            <Button
                                size="small"
                                variant="outlined"
                                startIcon={<OpenInNew />}
                                onClick={(event) => handleOpenProduct(event, product)}
                            >
                                Product
                            </Button>
                        </div>
                    );
                })}
                {extraItems ? (
                    <p className="text-xs text-gray-500">
                        +{extraItems} more item{extraItems === 1 ? "" : "s"} in this order
                    </p>
                ) : null}
            </div>
        </div>
    );
};
