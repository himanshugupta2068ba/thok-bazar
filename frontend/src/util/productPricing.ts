const calculateDiscount = (mrpPrice: number, sellingPrice: number) => {
  if (mrpPrice <= 0) return 0;

  return Math.max(0, Math.round(((mrpPrice - sellingPrice) / mrpPrice) * 100));
};

export const resolveProductPricing = (product: any) => {
  const mrpPrice = Number(product?.mrpPrice || 0);
  const baseSellingPrice = Number(product?.sellingPrice || 0);
  const effectiveSellingPrice = Number(
    product?.effectiveSellingPrice ??
      product?.dealSellingPrice ??
      product?.sellingPrice ??
      0,
  );
  const discount = Number(
    product?.effectiveDiscountPercentage ??
      calculateDiscount(mrpPrice, effectiveSellingPrice),
  );

  return {
    mrpPrice,
    baseSellingPrice,
    sellingPrice: effectiveSellingPrice,
    discount,
    savings: Math.max(mrpPrice - effectiveSellingPrice, 0),
    dealApplied: Boolean(product?.dealApplied),
    activeDeal: product?.activeDeal || null,
  };
};
