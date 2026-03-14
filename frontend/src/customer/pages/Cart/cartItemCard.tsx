import { Close, Favorite, FavoriteBorder } from "@mui/icons-material";
import { Button, Divider, IconButton } from "@mui/material";
import { useNavigate } from "react-router";
import {
  removeItemFromCart,
  updateCartItemQuantity,
} from "../../../Redux Toolkit/featurs/coustomer/cartSlice";
import {
  buildWishlistUserKey,
  toggleWishlistItem,
} from "../../../Redux Toolkit/featurs/coustomer/wishlistSlice";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/store";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1580854898508-4761a9c769a9?w=600&auto=format&fit=crop&q=60";

export const CartItemCard = ({ item }: any) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { auth, cart, user, wishlist } = useAppSelector((state) => state);

  const jwt = auth.jwt?.trim() || localStorage.getItem("jwt");
  const product = item?.product || {};
  const cartItemId = item?._id;
  const productId = item?.productId || product?._id;
  const quantity = Number(item?.quantity || 1);
  const title = product?.title || item?.title || "Product";
  const image = product?.images?.[0] || FALLBACK_IMAGE;
  const sellerName =
    product?.sellerId?.businessDetails?.businessName ||
    product?.sellerId?.sellerName ||
    "Seller";
  const size = item?.size || product?.size || "Standard";
  const itemPrice = Number(item?.sellingPrice || product?.sellingPrice || 0);
  const itemMrp = Number(item?.mrpPrice || product?.mrpPrice || 0);
  const loading = cart.loading;
  const wishlistUserKey = buildWishlistUserKey(auth.user, user.user);
  const isWishlisted = wishlist.items.some(
    (wishlistItem: any) => String(wishlistItem?._id) === String(productId),
  );
  const categoryId =
    product?.category?.categoryId ||
    product?.categoryId ||
    product?.mainCategory ||
    product?.subSubCategory ||
    "default";
  const productName = product?.title || item?.title || "product";

  const handleOpenProduct = () => {
    if (!productId) return;

    navigate(
      `/product-details/${categoryId}/${encodeURIComponent(productName)}/${productId}`,
    );
  };

  const handleQuantityChange = async (nextQuantity: number) => {
    if (!jwt || !cartItemId || nextQuantity < 1) return;

    await dispatch(
      updateCartItemQuantity({
        cartItemId,
        productId,
        quantity: nextQuantity,
        jwt,
      }),
    );
  };

  const handleRemove = async () => {
    if (!jwt || !cartItemId) return;

    await dispatch(
      removeItemFromCart({
        cartItemId,
        productId,
        jwt,
      }),
    );
  };

  const handleWishlistToggle = async () => {
    dispatch(
      toggleWishlistItem({
        item: product,
        userKey: wishlistUserKey,
      }),
    );
  };

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_44px_rgba(15,23,42,0.06)]">
      <div
        className="flex cursor-pointer gap-4 p-5 transition hover:bg-slate-50/80"
        onClick={handleOpenProduct}
      >
        <div className="rounded-[22px] bg-[linear-gradient(135deg,#effcf8_0%,#f8fafc_100%)] p-2">
          <img className="w-24 rounded-[18px]" src={image} alt={title} />
        </div>

        <div className="space-y-2 p-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
            Cart Item
          </p>
          <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
          <p className="text-sm font-medium text-gray-600">
            {product?.description || "Ready to ship product"}
          </p>
          <p className="text-xs text-gray-700">
            <strong>Sold by:</strong> {sellerName}
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Size {size}
            </span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
              Stock {product?.stock ?? "Available"}
            </span>
          </div>
        </div>
      </div>

      <Divider />

      <div className="flex items-center justify-between p-5 py-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-between gap-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-1">
            <Button
              variant="outlined"
              size="small"
              disabled={loading || quantity <= 1}
              className="rounded-full border-gray-300 text-gray-600 hover:border-gray-600 hover:text-gray-800"
              onClick={(event) => {
                event.stopPropagation();
                handleQuantityChange(quantity - 1);
              }}
              sx={{ minWidth: 34, borderRadius: "999px" }}
            >
              -
            </Button>
            <span className="min-w-8 text-center text-lg font-semibold text-slate-900">
              {quantity}
            </span>
            <Button
              variant="outlined"
              size="small"
              disabled={loading}
              className="rounded-full border-gray-300 text-gray-600 hover:border-gray-600 hover:text-gray-800"
              onClick={(event) => {
                event.stopPropagation();
                handleQuantityChange(quantity + 1);
              }}
              sx={{ minWidth: 34, borderRadius: "999px" }}
            >
              +
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-xs font-medium text-slate-500">
              Update quantity anytime before checkout.
            </p>
            <Button
              size="small"
              variant="text"
              startIcon={isWishlisted ? <Favorite /> : <FavoriteBorder />}
              onClick={(event) => {
                event.stopPropagation();
                handleWishlistToggle();
              }}
              sx={{ textTransform: "none", fontWeight: 700 }}
            >
              {isWishlisted ? "Wishlisted" : "Save to Wishlist"}
            </Button>
          </div>
        </div>

        <div className="text-right">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
            Price
          </p>
          <div className="mt-1 font-bold text-teal-800">Rs. {itemPrice}</div>
          {itemMrp > itemPrice ? (
            <div className="text-sm text-gray-500 line-through">Rs. {itemMrp}</div>
          ) : null}
        </div>
      </div>

      <div className="absolute right-3 top-3 cursor-pointer font-bold text-gray-500 hover:text-gray-800">
        <IconButton
          color="primary"
          onClick={(event) => {
            event.stopPropagation();
            handleRemove();
          }}
          disabled={loading}
          sx={{ backgroundColor: "rgba(248, 250, 252, 0.95)" }}
        >
          <Close />
        </IconButton>
      </div>
    </div>
  );
};
