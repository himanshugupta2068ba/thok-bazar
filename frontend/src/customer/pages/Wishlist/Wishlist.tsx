import { FavoriteBorder, LocalOffer, ShoppingBagOutlined } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useNavigate } from "react-router";
import { useAppSelector } from "../../../Redux Toolkit/store";
import { ProductCard } from "../Product/ProductCard";

export const Wishlist = () => {
  const navigate = useNavigate();
  const { wishlist } = useAppSelector((state) => state);
  const wishlistItems = wishlist.items || [];

  return (
    <div className="min-h-screen px-5 pb-12 pt-10 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-[1500px] space-y-6">
        <section className="rounded-[34px] border border-rose-100 bg-[radial-gradient(circle_at_top_left,_rgba(251,113,133,0.18),_transparent_30%),linear-gradient(135deg,_#fff7f9_0%,_#f8fafc_58%,_#ffffff_100%)] px-6 py-7 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/85 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-rose-600 shadow-sm">
                <FavoriteBorder sx={{ fontSize: 16 }} />
                Wishlist
              </span>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Keep the products you want close
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
                Save products for later, revisit them any time, and move them to cart when
                you are ready.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[24px] border border-white/80 bg-white/85 px-4 py-4 shadow-sm backdrop-blur">
                <div className="flex items-center gap-2 text-slate-400">
                  <ShoppingBagOutlined sx={{ fontSize: 18 }} />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.28em]">
                    Saved Items
                  </span>
                </div>
                <p className="mt-3 text-2xl font-semibold text-slate-900">
                  {wishlistItems.length}
                </p>
              </div>

              <div className="rounded-[24px] border border-white/80 bg-white/85 px-4 py-4 shadow-sm backdrop-blur">
                <div className="flex items-center gap-2 text-slate-400">
                  <LocalOffer sx={{ fontSize: 18 }} />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.28em]">
                    Ready to Cart
                  </span>
                </div>
                <p className="mt-3 text-2xl font-semibold text-slate-900">
                  {wishlistItems.length}
                </p>
              </div>
            </div>
          </div>
        </section>

        {!wishlistItems.length ? (
          <div className="rounded-[32px] border border-dashed border-slate-300 bg-[linear-gradient(135deg,#fff7f9_0%,#f8fafc_100%)] p-10 text-center shadow-[0_16px_42px_rgba(15,23,42,0.05)]">
            <h2 className="text-2xl font-semibold text-slate-900">Your wishlist is empty</h2>
            <p className="mt-3 text-slate-500">
              Tap the heart on any product card to save it here.
            </p>
            <Button sx={{ mt: 3 }} variant="outlined" onClick={() => navigate("/")}>
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="grid justify-center gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wishlistItems.map((item: any) => (
              <div key={item._id || item.productId} className="flex justify-center">
                <ProductCard item={item} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
