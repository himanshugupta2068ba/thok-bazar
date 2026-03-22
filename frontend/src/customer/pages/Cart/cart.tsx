import {
  Favorite,
  Inventory2Outlined,
  LocalOffer,
  ShoppingBagOutlined,
  SavingsOutlined,
} from "@mui/icons-material";
import { Alert, Button, Chip, TextField } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { fetchCart } from "../../../Redux Toolkit/featurs/coustomer/cartSlice";
import {
  applyCouponToCart,
  clearCouponFeedback,
  fetchActiveCoupons,
  removeCouponFromCart,
} from "../../../Redux Toolkit/featurs/coustomer/couponSlice";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/store";
import { getCartPricing } from "../../../util/cartPricing";
import { PricingCard } from "./PricingCard";
import { CartItemCard } from "./cartItemCard";

export const Cart = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { auth, cart, coupon } = useAppSelector((state) => state);
  const jwt = auth.jwt?.trim() || localStorage.getItem("jwt");
  const cartData = cart.cart;
  const [couponCode, setCouponCode] = useState("");

  const pricing = useMemo(() => getCartPricing(cartData), [cartData]);
  const cartItems = pricing.items;
  const totalAmount = pricing.payableAmount;
  const totalSavings = pricing.totalSavings;

  useEffect(() => {
    setCouponCode(pricing.couponCode || "");
  }, [pricing.couponCode]);

  useEffect(() => {
    if (!jwt) return;
    dispatch(fetchCart(jwt));
    dispatch(fetchActiveCoupons());
  }, [dispatch, jwt]);

  useEffect(() => {
    return () => {
      dispatch(clearCouponFeedback());
    };
  }, [dispatch]);

  const handleApplyCoupon = async (selectedCode?: string) => {
    if (!jwt) {
      navigate("/login");
      return;
    }

    const normalizedCode = String(selectedCode || couponCode).trim().toUpperCase();
    if (!normalizedCode) {
      return;
    }

    setCouponCode(normalizedCode);
    await dispatch(applyCouponToCart({ code: normalizedCode, jwt }));
  };

  const handleRemoveCoupon = async () => {
    if (!jwt) return;
    await dispatch(removeCouponFromCart(jwt));
  };

  if (!jwt) {
    return (
      <div className="min-h-screen px-5 pb-10 pt-10 sm:px-10 md:px-60">
        <div className="rounded-[32px] border border-dashed border-slate-300 bg-[linear-gradient(135deg,#f8fffd_0%,#f8fafc_100%)] p-8 text-center shadow-[0_18px_48px_rgba(15,23,42,0.06)]">
          <h1 className="text-2xl font-semibold text-gray-900">Login to view your cart</h1>
          <p className="mt-3 text-gray-600">
            Your saved items will appear here after you sign in.
          </p>
          <Button sx={{ mt: 3 }} variant="contained" onClick={() => navigate("/login")}>
            Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-5 pb-10 pt-10 sm:px-10 md:px-20 lg:px-28">
      <div className="space-y-6">
        <section className="rounded-[34px] border border-emerald-100 bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.18),_transparent_30%),linear-gradient(135deg,_#f7fffd_0%,#f8fafc_55%,#ffffff_100%)] px-6 py-7 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-teal-700 shadow-sm">
                <ShoppingBagOutlined sx={{ fontSize: 16 }} />
                Shopping Bag
              </span>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Your cart, styled and ready
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
                Review your picks, update quantities, and move to checkout when
                everything looks right.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[24px] border border-white/80 bg-white/85 px-4 py-4 shadow-sm backdrop-blur">
                <div className="flex items-center gap-2 text-slate-400">
                  <Inventory2Outlined sx={{ fontSize: 18 }} />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.28em]">
                    Items
                  </span>
                </div>
                <p className="mt-3 text-2xl font-semibold text-slate-900">
                  {pricing.totalItems || 0}
                </p>
              </div>

              <div className="rounded-[24px] border border-white/80 bg-white/85 px-4 py-4 shadow-sm backdrop-blur">
                <div className="flex items-center gap-2 text-slate-400">
                  <LocalOffer sx={{ fontSize: 18 }} />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.28em]">
                    Total
                  </span>
                </div>
                <p className="mt-3 text-2xl font-semibold text-slate-900">
                  Rs. {totalAmount}
                </p>
              </div>

              <div className="rounded-[24px] border border-white/80 bg-white/85 px-4 py-4 shadow-sm backdrop-blur">
                <div className="flex items-center gap-2 text-slate-400">
                  <SavingsOutlined sx={{ fontSize: 18 }} />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.28em]">
                    Savings
                  </span>
                </div>
                <p className="mt-3 text-2xl font-semibold text-slate-900">
                  Rs. {totalSavings}
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="space-y-3 lg:col-span-2">
            <div className="rounded-[28px] border border-slate-200 bg-white px-5 py-4 shadow-[0_18px_44px_rgba(15,23,42,0.06)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
                Cart Overview
              </p>
              <p className="mt-2 text-base text-slate-600">
                {pricing.totalItems || 0} item{pricing.totalItems === 1 ? "" : "s"} currently in your bag
              </p>
            </div>

            {cart.loading && !cartItems.length ? (
              <div className="rounded-[28px] border border-slate-200 bg-white p-6 text-sm text-gray-500 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                Loading your cart...
              </div>
            ) : null}

            {cart.error ? (
              <div className="rounded-[24px] border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {cart.error}
              </div>
            ) : null}

            {!cart.loading && !cartItems.length ? (
              <div className="rounded-[32px] border border-dashed border-slate-300 bg-[linear-gradient(135deg,#f8fffd_0%,#f8fafc_100%)] p-8 text-center shadow-[0_16px_42px_rgba(15,23,42,0.05)]">
                <h2 className="text-xl font-semibold text-gray-900">Your cart is empty</h2>
                <p className="mt-3 text-gray-500">
                  Add products from the catalog and they will appear here instantly.
                </p>
                <Button sx={{ mt: 3 }} variant="outlined" onClick={() => navigate("/")}>
                  Continue Shopping
                </Button>
              </div>
            ) : null}

            {cartItems.map((item: any) => (
              <CartItemCard key={item?._id || item?.productId || item?.product?._id} item={item} />
            ))}
          </div>

          <div className="col-span-1 space-y-3 text-sm">
            <div className="rounded-[28px] border border-slate-200 bg-white/95 px-5 py-4 shadow-[0_18px_44px_rgba(15,23,42,0.06)]">
              <div className="flex items-center gap-3 text-sm">
                <LocalOffer className="text-teal-600" />
                <h1 className="font-semibold text-teal-600">Apply Coupon</h1>
              </div>

              <div className="space-y-3 py-4">
                <div className="flex items-center gap-3">
                  <TextField
                    size="small"
                    label="Enter Coupon Code"
                    variant="outlined"
                    className="w-full"
                    value={couponCode}
                    onChange={(event) => {
                      setCouponCode(event.target.value.toUpperCase());
                      if (coupon.error || coupon.successMessage) {
                        dispatch(clearCouponFeedback());
                      }
                    }}
                    disabled={!cartItems.length || coupon.actionLoading}
                  />
                  <button
                    className={`rounded-full px-5 py-2 text-white ${
                      !cartItems.length || coupon.actionLoading || !couponCode.trim()
                        ? "bg-slate-300"
                        : "bg-teal-600 hover:bg-teal-700"
                    }`}
                    disabled={!cartItems.length || coupon.actionLoading || !couponCode.trim()}
                    onClick={() => handleApplyCoupon()}
                  >
                    {coupon.actionLoading ? "Applying..." : "Apply"}
                  </button>
                </div>

                {pricing.couponCode ? (
                  <div className="flex items-center justify-between rounded-[18px] border border-emerald-200 bg-emerald-50 px-4 py-3">
                    <div>
                      <p className="font-semibold text-emerald-700">{pricing.couponCode} applied</p>
                      <p className="text-xs text-emerald-700/80">
                        You saved Rs. {pricing.couponDiscountAmount} on this cart.
                      </p>
                    </div>
                    <Button
                      color="inherit"
                      size="small"
                      onClick={handleRemoveCoupon}
                      disabled={coupon.actionLoading}
                    >
                      Remove
                    </Button>
                  </div>
                ) : null}

                {coupon.error ? <Alert severity="error">{coupon.error}</Alert> : null}
                {coupon.successMessage ? <Alert severity="success">{coupon.successMessage}</Alert> : null}

                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                    Active Coupons
                  </p>

                  {!coupon.loading && !coupon.coupons.length ? (
                    <p className="text-xs text-gray-500">No active coupons are available right now.</p>
                  ) : null}

                  {coupon.coupons.map((activeCoupon: any) => {
                    const isApplied = pricing.couponCode === activeCoupon?.code;
                    const isEligible = pricing.orderValue >= Number(activeCoupon?.minOrderAmount || 0);

                    return (
                      <div
                        key={activeCoupon?._id || activeCoupon?.code}
                        className="rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-slate-900">{activeCoupon?.code}</p>
                              <Chip
                                size="small"
                                color={isEligible ? "success" : "default"}
                                label={isEligible ? "Eligible" : `Min Rs. ${activeCoupon?.minOrderAmount || 0}`}
                              />
                            </div>
                            <p className="mt-1 text-xs text-slate-600">
                              Save {activeCoupon?.discount || 0}% on orders above Rs. {activeCoupon?.minOrderAmount || 0}
                            </p>
                          </div>
                          <Button
                            size="small"
                            variant={isApplied ? "contained" : "outlined"}
                            disabled={coupon.actionLoading || !cartItems.length || (!isEligible && !isApplied)}
                            onClick={() =>
                              isApplied ? handleRemoveCoupon() : handleApplyCoupon(activeCoupon?.code)
                            }
                          >
                            {isApplied ? "Applied" : "Use"}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <section className="rounded-[24px] border border-slate-200 bg-slate-50/70">
                <PricingCard cart={cartData} />
                <div className="p-5">
                  <Button
                    variant="contained"
                    className="w-full bg-teal-600 hover:bg-teal-800"
                    disabled={!cartItems.length}
                    onClick={() => navigate("/checkout/address")}
                    sx={{ borderRadius: "999px", py: 1.2, textTransform: "none" }}
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              </section>

              <div
                className="mt-4 flex cursor-pointer items-center justify-between rounded-[22px] border border-slate-200 bg-slate-50 px-5 py-4"
                onClick={() => navigate("/wishlist")}
              >
                <span>Open Wishlist</span>
                <Favorite color="primary" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
