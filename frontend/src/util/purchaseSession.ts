const PURCHASED_PRODUCT_IDS_KEY = "checkout:purchasedProductIds";

export const persistPurchasedProductIds = (productIds: string[]) => {
  try {
    const normalizedIds = Array.from(
      new Set(productIds.map((productId) => String(productId || "")).filter(Boolean)),
    );
    localStorage.setItem(PURCHASED_PRODUCT_IDS_KEY, JSON.stringify(normalizedIds));
  } catch (error) {
    console.error("Failed to persist purchased product ids", error);
  }
};

export const loadPurchasedProductIds = (): string[] => {
  try {
    const rawValue = localStorage.getItem(PURCHASED_PRODUCT_IDS_KEY);
    if (!rawValue) return [];

    const parsedValue = JSON.parse(rawValue);
    return Array.isArray(parsedValue) ? parsedValue.map((item) => String(item)) : [];
  } catch (error) {
    console.error("Failed to load purchased product ids", error);
    return [];
  }
};

export const clearPurchasedProductIds = () => {
  try {
    localStorage.removeItem(PURCHASED_PRODUCT_IDS_KEY);
  } catch (error) {
    console.error("Failed to clear purchased product ids", error);
  }
};
