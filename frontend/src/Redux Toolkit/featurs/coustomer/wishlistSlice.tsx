import { createSlice } from "@reduxjs/toolkit";

const WISHLIST_STORAGE_PREFIX = "wishlist";

const getWishlistStorageKey = (userKey?: string) =>
  `${WISHLIST_STORAGE_PREFIX}:${userKey || "guest"}`;

const loadWishlistItems = (userKey?: string) => {
  try {
    const storedValue = localStorage.getItem(getWishlistStorageKey(userKey));
    if (!storedValue) return [];

    const parsedValue = JSON.parse(storedValue);
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch (error) {
    console.error("Failed to load wishlist items", error);
    return [];
  }
};

const persistWishlistItems = (userKey: string, items: any[]) => {
  try {
    localStorage.setItem(getWishlistStorageKey(userKey), JSON.stringify(items));
  } catch (error) {
    console.error("Failed to persist wishlist items", error);
  }
};

const normalizeWishlistItem = (item: any) => {
  const product = item?.product || item;
  const productId = product?._id || item?.productId || item?._id || item?.id;

  if (!productId) return null;

  const mrpPrice = Number(product?.mrpPrice || item?.mrpPrice || 0);
  const sellingPrice = Number(product?.sellingPrice || item?.sellingPrice || 0);
  const categoryId =
    product?.category?.categoryId ||
    product?.categoryId ||
    item?.category?.categoryId ||
    item?.categoryId ||
    product?.mainCategory ||
    product?.subSubCategory ||
    "default";

  return {
    ...product,
    _id: productId,
    productId,
    categoryId,
    mrpPrice,
    sellingPrice,
    discountPercentage:
      product?.discountPercentage ??
      (mrpPrice > 0 ? Math.round(((mrpPrice - sellingPrice) / mrpPrice) * 100) : 0),
  };
};

export const buildWishlistUserKey = (authUser?: any, profileUser?: any) =>
  String(
    profileUser?._id ||
      authUser?._id ||
      profileUser?.email ||
      authUser?.email ||
      "guest",
  );

const initialState = {
  items: [] as any[],
  userKey: "guest",
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    initializeWishlist: (state, action) => {
      const userKey = action.payload || "guest";
      state.userKey = userKey;
      state.items = loadWishlistItems(userKey);
    },
    addItemToWishlist: (state, action) => {
      const userKey = action.payload?.userKey || state.userKey || "guest";
      const normalizedItem = normalizeWishlistItem(action.payload?.item);

      if (!normalizedItem) return;

      state.userKey = userKey;

      const existingIndex = state.items.findIndex(
        (item) => String(item?._id) === String(normalizedItem._id),
      );

      if (existingIndex >= 0) {
        state.items[existingIndex] = normalizedItem;
      } else {
        state.items.unshift(normalizedItem);
      }

      persistWishlistItems(userKey, state.items);
    },
    removeItemFromWishlist: (state, action) => {
      const userKey = action.payload?.userKey || state.userKey || "guest";
      const productId = action.payload?.productId;

      state.userKey = userKey;
      state.items = state.items.filter(
        (item) => String(item?._id) !== String(productId),
      );

      persistWishlistItems(userKey, state.items);
    },
    toggleWishlistItem: (state, action) => {
      const userKey = action.payload?.userKey || state.userKey || "guest";
      const normalizedItem = normalizeWishlistItem(action.payload?.item);

      if (!normalizedItem) return;

      state.userKey = userKey;

      const alreadyExists = state.items.some(
        (item) => String(item?._id) === String(normalizedItem._id),
      );

      state.items = alreadyExists
        ? state.items.filter(
            (item) => String(item?._id) !== String(normalizedItem._id),
          )
        : [normalizedItem, ...state.items];

      persistWishlistItems(userKey, state.items);
    },
  },
});

export const {
  addItemToWishlist,
  initializeWishlist,
  removeItemFromWishlist,
  toggleWishlistItem,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
