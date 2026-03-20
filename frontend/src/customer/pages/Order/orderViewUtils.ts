export const getOrderStatusLabel = (status?: string) => {
  if (!status) return "Pending";
  return status.charAt(0) + status.slice(1).toLowerCase();
};

export const getOrderDisplayDate = (dateValue?: string) => {
  if (!dateValue) return "Date unavailable";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return date.toLocaleDateString();
};

export const getProductDetailsPath = (product: any) => {
  const productId = product?._id || product?.id;
  if (!productId) return "";

  const categoryId =
    product?.mainCategory ||
    product?.subSubCategory ||
    product?.subCategory ||
    product?.category?.categoryId ||
    product?.categoryId ||
    "default";
  const productName = product?.title || product?.name || "product";

  return `/product-details/${categoryId}/${encodeURIComponent(productName)}/${productId}`;
};

export const formatPaymentMethodLabel = (paymentMethod?: string) => {
  const normalizedMethod = String(paymentMethod || "").trim().toUpperCase();

  if (normalizedMethod === "COD") {
    return "Cash on Delivery";
  }

  if (normalizedMethod === "RAZORPAY") {
    return "Razorpay";
  }

  return paymentMethod || "Payment Method Unavailable";
};
