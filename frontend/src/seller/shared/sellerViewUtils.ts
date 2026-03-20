import type { ChipProps } from "@mui/material";

type ChipColor = ChipProps["color"];

export const ORDER_STATUS_OPTIONS = [
  "PENDING",
  "PLACED",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

export type SellerOrderStatus = (typeof ORDER_STATUS_OPTIONS)[number];

const orderStatusColorMap: Record<string, ChipColor> = {
  PENDING: "warning",
  PLACED: "info",
  CONFIRMED: "primary",
  SHIPPED: "secondary",
  DELIVERED: "success",
  CANCELLED: "error",
};

const paymentStatusColorMap: Record<string, ChipColor> = {
  RECEIVED: "success",
  PENDING: "warning",
  PROCESSING: "info",
  COMPLETED: "success",
  FAILED: "error",
  REFUNDED: "warning",
};

export const formatStatusLabel = (value?: string | null) => {
  if (!value) {
    return "-";
  }

  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

export const formatPaymentMethodLabel = (value?: string | null) => {
  const normalizedValue = String(value || "").trim().toUpperCase();

  if (normalizedValue === "COD") {
    return "Cash on Delivery";
  }

  if (normalizedValue === "RAZORPAY") {
    return "Razorpay";
  }

  return formatStatusLabel(value);
};

export const formatCurrency = (value?: number | string | null) => {
  const amount = Number(value ?? 0);

  if (Number.isNaN(amount)) {
    return "Rs. 0";
  }

  return `Rs. ${amount.toLocaleString("en-IN")}`;
};

export const formatDate = (value?: string | Date | null) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatDateTime = (value?: string | Date | null) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return `${formatDate(date)} ${date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};

export const getOrderStatusColor = (status?: string | null): ChipColor =>
  orderStatusColorMap[status || ""] || "default";

export const getPaymentStatusColor = (status?: string | null): ChipColor =>
  paymentStatusColorMap[status || ""] || "default";

export const getCustomerName = (customer: any) =>
  customer?.name || customer?.fullName || customer?.email || "Customer";

export const getCustomerContact = (customer: any) =>
  customer?.mobile || customer?.email || "-";

export const getAddressText = (address: any) =>
  [address?.address, address?.locality, address?.state, address?.pincode]
    .filter(Boolean)
    .join(", ") || "-";

export const getTransactionAmount = (transaction: any) =>
  Number(transaction?.order?.totalSellingPrice || 0);

export const getOrderTotal = (orderItem: any) =>
  Number(orderItem?.sellingPrice || 0) * Number(orderItem?.quantity || 0);

export const getTransactionStatus = (transaction: any) => {
  if (transaction?.status) {
    return transaction.status;
  }

  if (transaction?.order?.paymentStatus === "REFUNDED" || transaction?.order?.orderStatus === "CANCELLED") {
    return "REFUNDED";
  }

  return "RECEIVED";
};

export const isVisibleSellerTransaction = (transaction: any) =>
  Boolean(
    transaction?.order &&
      transaction?.order?.orderStatus &&
      Number(transaction?.order?.totalSellingPrice || 0) > 0 &&
      ["COMPLETED", "REFUNDED"].includes(String(transaction?.order?.paymentStatus || "")),
  );

export const isVisibleSellerOrder = (order: any) =>
  Boolean(
    order &&
      order?.orderStatus &&
      Number(order?.totalSellingPrice || 0) > 0 &&
      (
        ["COMPLETED", "REFUNDED"].includes(String(order?.paymentStatus || "")) ||
        String(order?.paymentMethod || "").toUpperCase() === "COD"
      ),
  );
