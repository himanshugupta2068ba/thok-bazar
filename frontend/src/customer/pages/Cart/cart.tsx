import {
  Favorite,
  Inventory2Outlined,
  LocalOffer,
  ShoppingBagOutlined,
  SavingsOutlined,
} from "@mui/icons-material";
import { Button, TextField } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { fetchCart } from "../../../Redux Toolkit/featurs/coustomer/cartSlice";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/store";
import { PricingCard } from "./PricingCard";
import { CartItemCard } from "./cartItemCard";

export const Cart = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { auth, cart } = useAppSelector((state) => state);
  const jwt = auth.jwt?.trim() || localStorage.getItem("jwt");
  const cartData = cart.cart;
  const cartItems = cartData?.items || [];
  const totalAmount = Number(cartData?.totalSellingPrice || 0);
  const totalSavings = Math.max(
    Number(cartData?.totalMrpPrice || 0) - Number(cartData?.totalSellingPrice || 0),
    0,
  );

  useEffect(() => {
    if (!jwt) return;
    dispatch(fetchCart(jwt));
  }, [dispatch, jwt]);

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
        <section className="rounded-[34px] border border-emerald-100 bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.18),_transparent_30%),linear-gradient(135deg,_#f7fffd_0%,_#f8fafc_55%,_#ffffff_100%)] px-6 py-7 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:px-8">
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
                  {cartData?.totalItems || 0}
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
                {cartData?.totalItems || 0} item{cartData?.totalItems === 1 ? "" : "s"} currently in your bag
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

              <div className="py-4">
                <div className="flex items-center">
                  <TextField
                    size="small"
                    label="Enter Coupon Code"
                    variant="outlined"
                    className="w-full"
                    disabled
                  />
                  <button
                    className="ml-3 rounded-full bg-slate-300 px-5 py-2 text-white"
                    disabled
                  >
                    Apply
                  </button>
                </div>
                <p className="mt-2 text-xs text-gray-500">Coupon support can be added next.</p>
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
