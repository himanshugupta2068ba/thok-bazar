import { ElectricBolt } from "@mui/icons-material"
import { Avatar } from "@mui/material"

const getStatusLabel = (status?: string) => {
    if (!status) return "Pending";
    return status.charAt(0) + status.slice(1).toLowerCase();
};

const getDisplayDate = (dateValue?: string) => {
    if (!dateValue) return "Date unavailable";
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return "Date unavailable";
    return date.toLocaleDateString();
};

export const OrderItemCart = ({ order }: any) => {
    const firstItem = order?.orderItems?.[0];
    const firstProduct = firstItem?.product;
    const image = firstProduct?.images?.[0] || "https://m.media-amazon.com/images/I/61jLi2nQJDL._SX679_.jpg";
    const title = firstProduct?.title || "Order item";
    const sellerName =
        firstProduct?.sellerId?.businessDetails?.businessName ||
        firstProduct?.sellerId?.sellerName ||
        "Seller";

    return (
        <div className="text-sm bg-white p-5 space-y-4 border border-gray-300 rounded-md cursor-pointer">
            <div className="flex items-center gap-3">
                <div>
                    <Avatar sizes="small" sx={{ bgcolor: "#00927c" }}>
                        <ElectricBolt />
                    </Avatar>
                </div>
                <div>
                    <h1 className="font-bold text-teal-600">{getStatusLabel(order?.orderStatus)}</h1>
                    <p>Ordered on {getDisplayDate(order?.createdAt)}</p>
                </div>
            </div>
            <div className="p-5 bg-teal-50 flex gap-3">
                <div>
                    <img className="w-17.5" src={image} alt="product image" />
                </div>
                <div className="w-full space-y-2">
                    <h1 className="font-bold">{sellerName}</h1>
                    <p>{title}</p>
                    <p><strong>size :</strong> {firstItem?.size || "N/A"}</p>
                </div>
            </div>
        </div>
    );
};