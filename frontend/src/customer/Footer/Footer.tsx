import {
  ArrowOutward,
  LocalShipping,
  Lock,
  Storefront,
  SupportAgent,
  WorkspacePremium,
} from "@mui/icons-material";
import { Link } from "react-router";

const shopLinks = [
  { label: "Men", to: "/products/men" },
  { label: "Women", to: "/products/women" },
  { label: "Home & Living", to: "/products/home-living" },
  { label: "Electronics", to: "/products/electronics" },
];

const supportLinks = [
  { label: "Home", to: "/" },
  { label: "My Profile", to: "/customer/profile" },
  { label: "Cart", to: "/cart" },
  { label: "Become a Seller", to: "/become-seller" },
];

const highlights = [
  {
    title: "Fast Delivery",
    description: "Reliable order movement for everyday shopping needs.",
    icon: LocalShipping,
  },
  {
    title: "Secure Payments",
    description: "Checkout flows designed for trust and convenience.",
    icon: Lock,
  },
  {
    title: "Seller Support",
    description: "A smoother path for businesses growing on Thok Bazar.",
    icon: SupportAgent,
  },
];

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 bg-[#172337] text-slate-200">
      <div className="border-b border-white/10 bg-[#0f1b2d]">
        <div className="mx-auto grid max-w-7xl gap-5 px-6 py-8 md:grid-cols-3 lg:px-10">
          {highlights.map(({ title, description, icon: Icon }) => (
            <div
              key={title}
              className="flex items-start gap-4 rounded-2xl border border-white/8 bg-white/4 p-4"
            >
              <div className="rounded-2xl bg-teal-500/15 p-3 text-teal-300">
                <Icon sx={{ fontSize: 22 }} />
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-[1.2fr_0.8fr_0.8fr_1.2fr]">
          <section>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
              About Thok Bazar
            </p>
            <h2 className="mt-4 max-w-sm text-3xl font-black leading-tight text-white">
              A modern marketplace for smarter everyday shopping.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
              Inspired by trusted ecommerce layouts, this storefront keeps the
              experience focused on discovery, dependable checkout, and easy
              seller onboarding.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-200">
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                Trending Deals
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                Verified Sellers
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                Bulk-Friendly Shopping
              </span>
            </div>
          </section>

          <section>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
              Shop
            </p>
            <div className="mt-5 space-y-3">
              {shopLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="block text-sm text-slate-300 transition hover:text-teal-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </section>

          <section>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
              Customer Care
            </p>
            <div className="mt-5 space-y-3">
              {supportLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="block text-sm text-slate-300 transition hover:text-teal-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="mt-6 space-y-3 text-sm text-slate-300">
              <div className="flex items-center gap-3">
                <WorkspacePremium sx={{ fontSize: 18 }} className="text-amber-300" />
                <span>Trusted shopping experience with curated product sections.</span>
              </div>
              <div className="flex items-center gap-3">
                <Storefront sx={{ fontSize: 18 }} className="text-amber-300" />
                <span>Built to support both customers and growing sellers.</span>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_18px_45px_rgba(0,0,0,0.24)]">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
              Developer Showcase
            </p>
            <h3 className="mt-4 text-2xl font-bold text-white">
              Explore the portfolio behind this build.
            </h3>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              If you want to showcase the developer, review more work, or
              connect beyond the store, the portfolio is the best place to
              continue.
            </p>

            <a
              href="https://himxsportfolio.netlify.app/"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
            >
              Visit Portfolio
              <ArrowOutward sx={{ fontSize: 18 }} />
            </a>

            <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/35 p-4 text-sm text-slate-300">
              <p className="font-medium text-white">Portfolio link</p>
              <p className="mt-2 break-all text-slate-400">
                https://himxsportfolio.netlify.app/
              </p>
            </div>
          </section>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-slate-400 lg:flex-row lg:items-center lg:justify-between">
          <p>
            Copyright {currentYear} Thok Bazar. Crafted for a polished ecommerce
            experience.
          </p>
          <p>
            Built with React, TypeScript, Tailwind CSS, and MUI for a
            marketplace-style interface.
          </p>
          <Link
            to="/admin/login"
            className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300 transition hover:border-white/25 hover:text-white"
          >
            I&apos;m Admin
          </Link>
        </div>
      </div>
    </footer>
  );
};
