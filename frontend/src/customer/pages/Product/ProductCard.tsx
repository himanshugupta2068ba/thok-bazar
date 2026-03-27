import { AddShoppingCart, Favorite, FavoriteBorder } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import { memo, useEffect, useMemo, useState, type MouseEvent } from "react";
import { useNavigate } from "react-router";
import { addItemTocart } from "../../../Redux Toolkit/featurs/coustomer/cartSlice";
import {
  buildWishlistUserKey,
  removeItemFromWishlist,
  toggleWishlistItem,
} from "../../../Redux Toolkit/featurs/coustomer/wishlistSlice";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/store";
import { resolveProductPricing } from "../../../util/productPricing";
import { optimizeImageUrl } from "../../../util/image";
import "./ProductCard.css";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1580854898508-4761a9c769a9?w=600&auto=format&fit=crop&q=60";

const formatLabel = (value?: string) => {
  if (!value) return "Collection";

  return value
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

type ProductCardProps = {
  item: any;
  removeFromWishlistOnAddToCart?: boolean;
};

export const ProductCard = memo(({ item, removeFromWishlistOnAddToCart = false }: ProductCardProps) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const authJwt = useAppSelector((state) => state.auth.jwt);
  const authUser = useAppSelector((state) => state.auth.user);
  const profileUser = useAppSelector((state) => state.user.user);

  const images = item?.images?.length ? item.images : [FALLBACK_IMAGE];
  const categoryId = item?.category?.categoryId || item?.categoryId || "default";
  const productId = item?._id || item?.productId || item?.id;
  const productName = item?.title || item?.name || "product";
  const jwt = authJwt?.trim() || localStorage.getItem("jwt");
  const wishlistUserKey = useMemo(
    () => buildWishlistUserKey(authUser, profileUser),
    [authUser, profileUser],
  );
  const categoryLabel = formatLabel(
    item?.mainCategory || item?.subSubCategory || item?.subCategory || categoryId,
  );
  const isWishlisted = useAppSelector((state) =>
    state.wishlist.items.some((wishlistItem: any) => String(wishlistItem?._id) === String(productId)),
  );

  const sellerName =
    item?.sellerId?.businessDetails?.businessName ||
    item?.sellerId?.sellerName ||
    item?.seller?.businessDetails?.businessName ||
    item?.seller?.bussinessDetails?.bussinessName ||
    "Seller";

  const { sellingPrice, mrpPrice, discount, savings, dealApplied, activeDeal } =
    resolveProductPricing(item);
  const optimizedImages = useMemo(
    () =>
      images.map((image: string) =>
        optimizeImageUrl(image, {
          width: 720,
          height: 960,
          fit: "crop",
          quality: 78,
        }),
      ),
    [images],
  );

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    if (isHovered && optimizedImages.length > 1) {
      interval = setInterval(() => {
        setCurrentImage((prev) => (prev + 1) % optimizedImages.length);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isHovered, optimizedImages.length]);

  useEffect(() => {
    setCurrentImage(0);
  }, [optimizedImages.length, productId]);

  const handleOpenProduct = () => {
    navigate(`/product-details/${categoryId}/${encodeURIComponent(productName)}/${productId}`);
  };

  const handleAddToCart = async (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (!productId) return;

    if (!jwt) {
      navigate("/login");
      return;
    }

    try {
      setIsAdding(true);
      await dispatch(
        addItemTocart({
          productId,
          quantity: 1,
          jwt,
        }),
      ).unwrap();
      if (removeFromWishlistOnAddToCart) {
        dispatch(
          removeItemFromWishlist({
            productId,
            userKey: wishlistUserKey,
          }),
        );
      }
      navigate("/cart");
    } catch (error) {
      console.error("Failed to add item to cart", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleWishlistToggle = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    dispatch(
      toggleWishlistItem({
        item,
        userKey: wishlistUserKey,
      }),
    );
  };

  return (
    <div onClick={handleOpenProduct} className="product-card group relative w-full px-3">
      <div className="product-card-shell overflow-hidden rounded-[28px]">
        <div
          className="product-card-image relative h-80 overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2">
            <span className="product-card-badge product-card-badge--soft">
              {categoryLabel}
            </span>
            {discount > 0 ? (
              <span className="product-card-badge product-card-badge--accent">
                {dealApplied && activeDeal?.discount
                  ? `Deal ${activeDeal.discount}% Off`
                  : `${discount}% Off`}
              </span>
            ) : null}
          </div>

          <div className="absolute right-4 top-4 z-10">
            <IconButton
              onClick={handleWishlistToggle}
              sx={{
                backgroundColor: "rgba(255,255,255,0.88)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.7)",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.98)",
                },
              }}
            >
              {isWishlisted ? (
                <Favorite sx={{ color: "#e11d48" }} />
              ) : (
                <FavoriteBorder sx={{ color: "#0f172a" }} />
              )}
            </IconButton>
          </div>

          <img
            src={optimizedImages[currentImage] || FALLBACK_IMAGE}
            alt={productName}
            loading="lazy"
            decoding="async"
            sizes="(min-width: 1280px) 18vw, (min-width: 1024px) 24vw, (min-width: 640px) 38vw, 88vw"
            className="card-media object-top"
          />
        </div>

        <div className="px-4 pb-4 pt-4">
          <div className="space-y-3">
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
                {sellerName}
              </p>
              <h2 className="product-title-clamp text-base font-semibold leading-6 text-slate-900">
                {productName}
              </h2>
            </div>

            <div className="flex items-end justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-slate-900">Rs. {sellingPrice}</span>
                  <span className="text-sm text-slate-400 line-through">Rs. {mrpPrice}</span>
                </div>
                <p className="text-sm font-medium text-teal-700">
                  You save Rs. {savings}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-100 px-3 py-2 text-right">
                <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
                  Status
                </p>
                <p className="text-sm font-semibold text-slate-700">Ready to ship</p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <Button
              startIcon={<AddShoppingCart />}
              variant="outlined"
              fullWidth
              disabled={isAdding}
              onClick={handleAddToCart}
              sx={{
                borderRadius: "999px",
                borderColor: "rgba(15, 118, 110, 0.28)",
                color: "#0f766e",
                fontWeight: 700,
                py: 1.2,
                textTransform: "none",
                backgroundColor: "rgba(240, 253, 250, 0.9)",
                "&:hover": {
                  borderColor: "#0f766e",
                  backgroundColor: "rgba(204, 251, 241, 0.95)",
                },
              }}
            >
              {isAdding ? "Adding..." : "Add to Cart"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = "ProductCard";
