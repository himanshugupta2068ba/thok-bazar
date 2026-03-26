import { useState } from "react";
import { SellerAccountForm } from "./SellerAcountForm";
import { SellerLogin } from "./SellerLogin";
import { Button } from "@mui/material";

const sellerHighlights = [
  {
    title: "Manage orders",
    description: "Track new, packed, shipped, and completed orders in one place.",
  },
  {
    title: "Manage products",
    description: "Add products, update listings, and keep your catalog ready to sell.",
  },
  {
    title: "Track payments",
    description: "View payouts, transactions, and seller reports from your dashboard.",
  },
];

export const BecomeSeller = () => {
    const [isloggedIn, setIsLoggedIn] = useState(false);
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.14),_transparent_36%),linear-gradient(180deg,#f8fafc_0%,#eff6ff_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.08),_transparent_70%)]" />
      <div className={`relative mx-auto ${isloggedIn ? "max-w-5xl" : "max-w-7xl"}`}>
        <div
          className={`grid min-h-[calc(100vh-4rem)] gap-6 ${
            isloggedIn ? "lg:grid-cols-1" : "lg:grid-cols-[minmax(0,1.04fr)_minmax(340px,0.96fr)]"
          }`}
        >
          <section className="order-1 flex">
            <div className="w-full rounded-[34px] border border-white/70 bg-white/85 p-3 shadow-[0_30px_90px_rgba(15,23,42,0.08)] backdrop-blur">
              <div className="rounded-[30px] bg-[linear-gradient(180deg,#fbfffd_0%,#f8fafc_100%)] p-5 sm:p-6 lg:p-8">
                <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-700">
                        Thok Bazar Sellers
                      </p>
                      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-[2.35rem]">
                        Seller Account
                      </h1>
                      <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-[15px]">
                        Login to your seller dashboard or create an account to start selling on Thok Bazar.
                      </p>
                    </div>

                    <div className="rounded-[22px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 shadow-sm">
                      <p className="font-semibold">Seller access</p>
                      <p className="mt-1 text-emerald-800/90">Login and account creation in one place.</p>
                    </div>
                  </div>

                  <div className="flex justify-start">
                    <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 shadow-sm">
                      <Button
                        variant={isloggedIn ? "text" : "contained"}
                        onClick={() => setIsLoggedIn(false)}
                        sx={{
                          borderRadius: "999px",
                          px: 3,
                          py: 1.1,
                          textTransform: "none",
                          fontWeight: 700,
                          boxShadow: !isloggedIn ? "none" : undefined,
                        }}
                      >
                        Seller Login
                      </Button>
                      <Button
                        variant={isloggedIn ? "contained" : "text"}
                        onClick={() => setIsLoggedIn(true)}
                        sx={{
                          borderRadius: "999px",
                          px: 3,
                          py: 1.1,
                          textTransform: "none",
                          fontWeight: 700,
                          boxShadow: isloggedIn ? "none" : undefined,
                        }}
                      >
                        Create Account
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
                  {isloggedIn ? (
                    <SellerAccountForm onSuccess={() => setIsLoggedIn(false)} />
                  ) : (
                    <SellerLogin />
                  )}
                </div>

                <p className="mt-5 text-center text-sm text-slate-600">
                  {isloggedIn ? "Already registered?" : "Need a seller account?"}{" "}
                  <button
                    type="button"
                    onClick={() => setIsLoggedIn(!isloggedIn)}
                    className="font-semibold text-emerald-700 transition hover:text-emerald-800"
                  >
                    {isloggedIn ? "Switch to login" : "Start onboarding"}
                  </button>
                </p>
              </div>
            </div>
          </section>

          {!isloggedIn ? (
          <section className="order-2">
            <div className="relative flex h-full min-h-[320px] overflow-hidden rounded-[34px] bg-slate-950 p-6 text-white shadow-[0_30px_90px_rgba(15,23,42,0.18)] sm:p-8 lg:p-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(45,212,191,0.24),_transparent_34%),radial-gradient(circle_at_bottom_left,_rgba(251,191,36,0.18),_transparent_30%)]" />
              <div className="absolute inset-x-0 bottom-0 h-56 bg-[linear-gradient(180deg,transparent_0%,rgba(15,23,42,0.66)_100%)]" />

              <div className="relative flex h-full w-full flex-col justify-between gap-8">
                <div>
                  <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-100">
                    Sell on Thok Bazar
                  </span>
                  <h2 className="mt-5 max-w-lg text-3xl font-semibold leading-tight sm:text-[2.4rem]">
                    Start selling with a simple seller dashboard.
                  </h2>
                  <p className="mt-4 max-w-xl text-sm leading-7 text-slate-200/90 sm:text-[15px]">
                    Create your seller account, manage products, handle orders, and track payments.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                  {sellerHighlights.map((highlight) => (
                    <div
                      key={highlight.title}
                      className="rounded-[24px] border border-white/10 bg-white/10 p-4 backdrop-blur-sm"
                    >
                      <p className="text-sm font-semibold text-white">{highlight.title}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-200/80">{highlight.description}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-[28px] border border-white/10 bg-white/8 p-4 backdrop-blur-sm sm:p-5">
                  <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_220px]">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-100">
                        What You Need
                      </p>
                      <div className="mt-4 space-y-3">
                        <div className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-sm text-slate-100">
                          Contact details, GSTIN, and pickup address
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-sm text-slate-100">
                          Bank details and business information
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-sm text-slate-100">
                          Email and password for your seller account
                        </div>
                      </div>
                    </div>

                    <div className="relative mx-auto w-full max-w-[220px]">
                      <div className="absolute inset-0 rounded-full bg-emerald-300/20 blur-3xl" />
                      <img
                        className="relative w-full object-contain drop-shadow-[0_20px_40px_rgba(15,23,42,0.35)]"
                        src="/BecomeSeller.png"
                        alt="Seller onboarding illustration"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          ) : null}
        </div>
      </div>
    </section>
  );
};
