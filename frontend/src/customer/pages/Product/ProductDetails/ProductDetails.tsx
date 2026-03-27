import {
  Add,
  AddShoppingCart,
  Favorite,
  FavoriteBorder,
  LocalShipping,
  Remove,
  Shield,
  Star,
  Wallet,
  WorkspacePremium,
} from "@mui/icons-material";
import { Button } from "@mui/material";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router";
import { addItemTocart } from "../../../../Redux Toolkit/featurs/coustomer/cartSlice";
import { fetchProductById } from "../../../../Redux Toolkit/featurs/coustomer/productSlice";
import {
  buildWishlistUserKey,
  toggleWishlistItem,
} from "../../../../Redux Toolkit/featurs/coustomer/wishlistSlice";
import { useAppDispatch, useAppSelector } from "../../../../Redux Toolkit/store";
import { useInView } from "../../../../common/useInView";
import { api } from "../../../../config/api";
import {
  getProductSpecificationFields,
  getSpecificationValue,
  resolveMainCategoryId,
} from "../../../../data/product/productConfig";
import { optimizeImageUrl } from "../../../../util/image";
import { resolveProductPricing } from "../../../../util/productPricing";
import { SimilarProduct } from "./SimilarProduct";

const fallbackImages = [
  "https://images.unsplash.com/photo-1580854898508-4761a9c769a9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8d29tZW4lMjBzYXJlZXxlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1756483482418-3f3e4c13f9b0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8d29tZW4lMjBzYXJlZXxlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1677002419193-9a74069587af?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHdvbWVuJTIwc2FyZWV8ZW58MHx8MHx8fDA%3D",
];

const REVIEW_SECTION_ID = "product-reviews";

const renderStars = (rating: number) =>
  Array.from({ length: 5 }, (_, index) => (
    <Star
      key={`${rating}-${index}`}
      sx={{ fontSize: 18 }}
      className={index < rating ? "text-yellow-500" : "text-gray-300"}
    />
  ));

export const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const productData: any = useAppSelector((state) => state.product.product) || {};
  const authJwt = useAppSelector((state) => state.auth.jwt);
  const authUser = useAppSelector((state) => state.auth.user);
  const profileUser = useAppSelector((state) => state.user.user);
  const isWishlisted = useAppSelector((state) =>
    state.wishlist.items.some((wishlistItem: any) => String(wishlistItem?._id) === String(productId)),
  );
  const [reviews, setReviews] = useState<any[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  });
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [hoveredImageIndex, setHoveredImageIndex] = useState<number | null>(null);

  const jwt = authJwt?.trim() || localStorage.getItem("jwt");
  const isLoggedIn = Boolean(jwt);
  const wishlistUserKey = useMemo(
    () => buildWishlistUserKey(authUser, profileUser),
    [authUser, profileUser],
  );
  const { inView: shouldLoadReviews, ref: reviewSectionRef } = useInView<HTMLElement>({
    rootMargin: "260px 0px",
  });
  const { inView: shouldLoadSimilarProducts, ref: similarProductsRef } = useInView<HTMLElement>({
    rootMargin: "320px 0px",
  });

  useEffect(() => {
    if (!productId) return;

    const request = dispatch(fetchProductById(productId));

    return () => {
      request.abort();
    };
  }, [dispatch, productId]);

  useEffect(() => {
    setReviews([]);
    setAverageRating(0);
    setTotalReviews(0);
    setReviewError("");
  }, [productId]);

  useEffect(() => {
    if (!productId || !shouldLoadReviews) return;

    const controller = new AbortController();

    setReviewLoading(true);
    setReviewError("");

    api
      .get(`/products/${productId}/reviews`, {
        signal: controller.signal,
      })
      .then((response) => {
        setReviews(response.data?.reviews || []);
        setAverageRating(Number(response.data?.averageRating || 0));
        setTotalReviews(Number(response.data?.totalReviews || 0));
      })
      .catch((error) => {
        if (error?.code === "ERR_CANCELED" || error?.name === "CanceledError") {
          return;
        }

        console.error("Failed to fetch reviews", error);
        setReviewError("Unable to load reviews right now.");
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setReviewLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [productId, shouldLoadReviews]);

  const imagesList = useMemo(() => {
    if (Array.isArray(productData?.images) && productData.images.length) {
      return productData.images;
    }

    return fallbackImages;
  }, [productData]);
  const thumbnailImages = useMemo(
    () =>
      imagesList.map((image: string) =>
        optimizeImageUrl(image, {
          width: 160,
          height: 160,
          fit: "crop",
          quality: 70,
        }),
      ),
    [imagesList],
  );
  const previewImages = useMemo(
    () =>
      imagesList.map((image: string) =>
        optimizeImageUrl(image, {
          width: 1200,
          height: 1400,
          fit: "crop",
          quality: 82,
        }),
      ),
    [imagesList],
  );

  useEffect(() => {
    setSelectedImageIndex(0);
    setHoveredImageIndex(null);
  }, [imagesList, productId]);

  const activeImageIndex = hoveredImageIndex ?? selectedImageIndex;
  const currentImage = previewImages[activeImageIndex] || previewImages[0] || fallbackImages[0];

  const handleHover = (index: number) => {
    setHoveredImageIndex(index);
  };

  const handleLeave = () => {
    setHoveredImageIndex(null);
  };

  const handleClick = (index: number) => {
    setSelectedImageIndex(index);
    setHoveredImageIndex(null);
  };

  const sellerName =
    productData?.sellerId?.businessDetails?.businessName ||
    productData?.sellerId?.sellerName ||
    productData?.sellerId?.name ||
    "Zara Clothing";
  const productTitle = productData?.title || "Marron Floral Patterned Saree";
  const { sellingPrice, mrpPrice, discount, dealApplied, activeDeal } =
    resolveProductPricing(productData);
  const productDescription =
    productData?.description ||
    "This product is crafted to balance quality, comfort, and everyday value across modern shopping needs.";

  const mainCategoryId = resolveMainCategoryId(
    productData?.mainCategory ||
      productData?.subSubCategory ||
      productData?.category?.categoryId,
  );
  const visibleSpecifications = useMemo(() => {
    return getProductSpecificationFields(mainCategoryId)
      .map((field) => ({
        label: field.label,
        value: getSpecificationValue(productData, field.key),
      }))
      .filter((field) => field.value);
  }, [mainCategoryId, productData]);

  const currentUserReview = useMemo(() => {
    if (!profileUser?._id) return null;
    return (
      reviews.find(
        (review) => String(review.userId?._id) === String(profileUser?._id),
      ) || null
    );
  }, [profileUser?._id, reviews]);

  const handleQuantityChange = (type: "increment" | "decrement") => {
    if (type === "increment") {
      setQuantity((prev) => prev + 1);
    } else {
      setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    }
  };

  const handleScrollToReviews = () => {
    document.getElementById(REVIEW_SECTION_ID)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const addCurrentProductToCart = async (redirectTo: string) => {
    if (!productId) return;

    if (!jwt) {
      navigate("/login");
      return;
    }

    try {
      setIsAddingToCart(true);
      await dispatch(
        addItemTocart({
          productId,
          quantity,
          jwt,
        }),
      ).unwrap();
      navigate(redirectTo);
    } catch (error) {
      console.error("Failed to add item to cart", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleAddToCart = () => addCurrentProductToCart("/cart");
  const handleBuyNow = () => addCurrentProductToCart("/checkout/address");
  const handleWishlistToggle = () => {
    dispatch(
      toggleWishlistItem({
        item: productData,
        userKey: wishlistUserKey,
      }),
    );
  };

  const handleSubmitReview = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!productId) return;

    if (!jwt) {
      navigate("/login");
      return;
    }

    if (!reviewForm.comment.trim()) {
      setReviewError("Please write a short review before submitting.");
      return;
    }

    setSubmittingReview(true);
    setReviewError("");

    try {
      const response = await api.post(
        `/products/${productId}/reviews`,
        {
          rating: reviewForm.rating,
          comment: reviewForm.comment.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        },
      );

      setReviews(response.data?.reviews || []);
      setAverageRating(Number(response.data?.averageRating || 0));
      setTotalReviews(Number(response.data?.totalReviews || 0));
      setReviewForm({
        rating: 5,
        comment: "",
      });
    } catch (error: any) {
      setReviewError(
        error?.response?.data?.message || "Unable to submit review right now.",
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="min-h-screen px-5 pt-10 lg:px-20">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <section className="flex flex-col gap-5 lg:flex-row">
          <div className="flex w-full flex-wrap gap-3 lg:w-[15%] lg:flex-col">
            {thumbnailImages.map((imgSrc: string, index: number) => (
              <img
                onMouseEnter={() => handleHover(index)}
                onMouseLeave={handleLeave}
                onClick={() => handleClick(index)}
                key={imgSrc}
                src={imgSrc}
                alt={`${productTitle} preview ${index + 1}`}
                loading="lazy"
                decoding="async"
                className="w-12.5 cursor-pointer rounded-md border-2 border-gray-300 lg:w-full"
              />
            ))}
          </div>
          <div className="w-full lg:w-[85%]">
            <img
              src={currentImage}
              alt={productTitle}
              fetchPriority="high"
              decoding="async"
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="w-full rounded-md border-2 border-gray-300"
            />
          </div>
        </section>

        <section>
          <h1 className="text-lg font-bold text-teal-500">{sellerName}</h1>
          <p className="font-semibold text-gray-500">{productTitle}</p>

          <div className="mt-5 flex flex-wrap items-center gap-4 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
            <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
              <span className="text-xl font-bold text-teal-700">
                {averageRating ? averageRating.toFixed(1) : "New"}
              </span>
              <Star className="text-yellow-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {totalReviews} review{totalReviews === 1 ? "" : "s"}
              </p>
              <div className="flex items-center">
                {renderStars(Math.round(averageRating || 0))}
              </div>
            </div>
            <Button variant="text" onClick={handleScrollToReviews}>
              See Reviews
            </Button>
          </div>

          <div className="space-y-2 pt-5">
            <div className="price flex items-center gap-3">
              <span className="font-bold text-teal-800">Rs. {sellingPrice}</span>
              <span className="line-through text-gray-500 text-sm-blur">
                Rs. {mrpPrice}
              </span>
              <span className="text-sm text-green-600">{discount}% off</span>
            </div>
            {dealApplied && activeDeal?.discount ? (
              <p className="text-sm font-medium text-orange-600">
                Live deal applied: extra {activeDeal.discount}% off this category.
              </p>
            ) : null}
            <p>Inclusive of all taxes</p>
          </div>

          <div className="mt-7 space-y-3">
            <div className="flex items-center gap-4">
              <Shield color="primary" />
              <span className="ml-2">Authentic and assured quality</span>
            </div>
            <div className="flex items-center gap-4">
              <WorkspacePremium color="primary" />
              <span className="ml-2">100% money back guarantee</span>
            </div>
            <div className="flex items-center gap-4">
              <LocalShipping color="primary" />
              <span className="ml-2">Free shipping</span>
            </div>
            <div className="flex items-center gap-4">
              <Wallet color="primary" />
              <span className="ml-2">Secure payment</span>
            </div>
          </div>

          <div className="mt-7 space-y-2">
            <h1>Quantity</h1>
            <div className="flex w-35 items-center gap-5">
              <Button variant="outlined" onClick={() => handleQuantityChange("decrement")}>
                <Remove />
              </Button>
              <span>{quantity}</span>
              <Button variant="outlined" onClick={() => handleQuantityChange("increment")}>
                <Add />
              </Button>
            </div>
          </div>

          <div className="mt-12 flex items-center gap-5">
            <Button
              startIcon={<AddShoppingCart />}
              variant="contained"
              color="primary"
              className="w-40 py-3 font-bold"
              disabled={isAddingToCart}
              onClick={handleAddToCart}
            >
              {isAddingToCart ? "Adding..." : "Add to Cart"}
            </Button>
            <Button
              variant="outlined"
              color="primary"
              className="w-40 py-3 font-bold"
              onClick={handleBuyNow}
              disabled={isAddingToCart}
            >
              Buy Now
            </Button>
            <Button
              variant="outlined"
              color="primary"
              className="py-3 font-bold"
              onClick={handleWishlistToggle}
              startIcon={isWishlisted ? <Favorite /> : <FavoriteBorder />}
            >
              {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
            </Button>
          </div>

          <div className="mt-10">
            <p className="mb-3 text-lg font-bold">Product Details</p>
            <p className="text-gray-600">{productDescription}</p>
          </div>

          {visibleSpecifications.length ? (
            <div className="mt-10">
              <p className="mb-3 text-lg font-bold">Specifications</p>
              <div className="grid grid-cols-1 gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:grid-cols-2">
                {visibleSpecifications.map((specification) => (
                  <div
                    key={specification.label}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-3"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      {specification.label}
                    </p>
                    <p className="mt-1 font-medium text-gray-800">
                      {specification.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </section>
      </div>

      <section
        ref={reviewSectionRef}
        id={REVIEW_SECTION_ID}
        className="mt-20 grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_0.8fr]"
      >
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">Customer Reviews</h1>
              <p className="text-sm text-gray-500">
                Real feedback from signed-in customers.
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-teal-700">
                {averageRating ? averageRating.toFixed(1) : "0.0"}
              </p>
              <p className="text-sm text-gray-500">
                {totalReviews} review{totalReviews === 1 ? "" : "s"}
              </p>
            </div>
          </div>

          {!shouldLoadReviews ? (
            <p className="text-sm text-gray-500">Reviews will load as you reach this section.</p>
          ) : reviewLoading ? (
            <p className="text-sm text-gray-500">Loading reviews...</p>
          ) : reviews.length ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {review.userId?.name || "Customer"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center">
                      {renderStars(Number(review.rating || 0))}
                    </div>
                  </div>
                  <p className="mt-3 leading-7 text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-sm text-gray-500">
              No reviews yet. Be the first one to share feedback on this product.
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">Write a Review</h2>
          <p className="mt-2 text-sm text-gray-500">
            Only logged-in customers can submit a review.
          </p>

          {currentUserReview ? (
            <div className="mt-6 rounded-2xl border border-teal-200 bg-teal-50 p-4 text-sm text-teal-900">
              You already reviewed this product as {currentUserReview.userId?.name || "Customer"}.
            </div>
          ) : isLoggedIn ? (
            <form className="mt-6 space-y-4" onSubmit={handleSubmitReview}>
              <div>
                <p className="mb-2 text-sm font-semibold text-gray-700">
                  Rating
                </p>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() =>
                        setReviewForm((prev) => ({
                          ...prev,
                          rating,
                        }))
                      }
                      className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                        reviewForm.rating === rating
                          ? "border-teal-600 bg-teal-600 text-white"
                          : "border-gray-300 bg-white text-gray-700"
                      }`}
                    >
                      {rating} Star{rating === 1 ? "" : "s"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-gray-700">Comment</p>
                <textarea
                  value={reviewForm.comment}
                  onChange={(event) =>
                    setReviewForm((prev) => ({
                      ...prev,
                      comment: event.target.value,
                    }))
                  }
                  placeholder="Share what you liked or what could be better."
                  className="min-h-32 w-full rounded-2xl border border-gray-300 bg-white p-3 outline-none transition focus:border-teal-500"
                />
              </div>

              {reviewError ? (
                <p className="text-sm text-red-600">{reviewError}</p>
              ) : null}

              <Button type="submit" variant="contained" disabled={submittingReview}>
                {submittingReview ? "Submitting..." : "Submit Review"}
              </Button>
            </form>
          ) : (
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <p>Please log in to write a review for this product.</p>
              <Button sx={{ mt: 2 }} variant="outlined" onClick={() => navigate("/login")}>
                Login to Review
              </Button>
            </div>
          )}
        </div>
      </section>

      <section ref={similarProductsRef} className="mt-20">
        <h1 className="text-lg font-bold">Similar Products</h1>
        <div className="pt-5">
          {shouldLoadSimilarProducts ? (
            <SimilarProduct productId={productId} />
          ) : (
            <p className="text-sm text-gray-500">
              Similar products will appear here as you keep browsing.
            </p>
          )}
        </div>
      </section>
    </div>
  );
};
