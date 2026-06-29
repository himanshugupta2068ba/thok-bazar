import { lazy, Suspense, useEffect, useState, type FormEvent } from "react";
import {
  AccountCircle,
  AddShoppingCart,
  Close,
  FavoriteBorder,
  Menu,
  Search,
  Storefront,
} from "@mui/icons-material";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Drawer,
  InputBase,
  IconButton,
} from "@mui/material";
import "./Navbar.css";
import mainCategory from "../../data/category/mainCategory";
import { useLocation, useNavigate } from "react-router";
import { useAppSelector } from "../../Redux Toolkit/store";
import { optimizeImageUrl } from "../../util/image";

const LazyCategorySheet = lazy(() =>
  import("./Category").then((module) => ({
    default: module.CategorySheet,
  })),
);

const mobileCategoryItems = [{ name: "All", categoryid: "" }, ...mainCategory];

export const Navbar = () => {
  const customerName = useAppSelector((state) => state.user.user?.name || "");
  const cartItemCount = useAppSelector((state) => state.cart.cart?.totalItems || 0);
  const wishlistItemCount = useAppSelector((state) => state.wishlist.items?.length || 0);
  const [showSheet, setShowSheet] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isMobileNavCondensed, setIsMobileNavCondensed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(mainCategory[0]?.categoryid || "");
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchTerm(params.get("q") || "");
  }, [location.search]);

  useEffect(() => {
    let collapseTimer: ReturnType<typeof window.setTimeout>;

    const handleScroll = () => {
      const shouldCondense = window.scrollY > 28;

      window.clearTimeout(collapseTimer);
      collapseTimer = window.setTimeout(
        () => setIsMobileNavCondensed(shouldCondense),
        shouldCondense ? 120 : 0,
      );
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.clearTimeout(collapseTimer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSearchSubmit = () => {
    const trimmedSearchTerm = searchTerm.trim();

    if (trimmedSearchTerm) {
      navigate(`/products?q=${encodeURIComponent(trimmedSearchTerm)}`);
      return;
    }

    navigate("/products");
  };

  const handleMainCategoryClick = (categoryId: string) => {
    setShowSheet(false);
    setShowMobileMenu(false);
    setShowMobileSearch(false);
    navigate(`/products/${categoryId}`);
  };

  const handleSearchFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSearchSubmit();
    setShowMobileSearch(false);
  };

  const handleAccountNavigation = () => {
    navigate(customerName ? "/customer/profile" : "/login");
  };

  return (
    <Box
      onMouseLeave={() => setShowSheet(false)}
      className="sticky top-0 left-0 right-0 z-120 bg-white/90 blur-bg shadow-sm"
    >
      <div
        className={`px-3 transition-[padding,border-color] duration-300 ease-out lg:hidden ${
          isMobileNavCondensed
            ? "border-b border-gray-200 py-2"
            : "border-b border-gray-200 py-2.5"
        }`}
      >
        <div className="flex h-10 items-center justify-between gap-3 lg:hidden">
          {showMobileSearch ? (
            <form
              onSubmit={handleSearchFormSubmit}
              className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5"
            >
              <Search sx={{ fontSize: 20, color: "#64748b", flexShrink: 0 }} />
              <InputBase
                autoFocus
                placeholder="Search products"
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                inputProps={{
                  "aria-label": "Search products",
                  autoComplete: "off",
                  enterKeyHint: "search",
                }}
                sx={{ minWidth: 0, width: "100%", fontSize: 14 }}
              />
              <IconButton
                size="small"
                aria-label="Close search"
                onClick={() => setShowMobileSearch(false)}
              >
                <Close sx={{ fontSize: 19 }} />
              </IconButton>
            </form>
          ) : (
            <>
              <IconButton
                className="h-10 w-10 shrink-0 border border-slate-200 bg-white"
                aria-label="Open categories"
                onClick={() => setShowMobileMenu(true)}
              >
                <Menu sx={{ fontSize: 22 }} />
              </IconButton>

              <button
                type="button"
                onClick={() => navigate("/")}
                className="min-w-0 flex-1 text-left"
                aria-label="Go to home"
              >
                <h1 className="logo truncate text-xl leading-none">GrowLine</h1>
              </button>
            </>
          )}

          {!showMobileSearch ? (
            <div className="flex shrink-0 items-center gap-2">
              <IconButton
                className="h-10 w-10 border border-slate-200 bg-white"
                aria-label="Search products"
                onClick={() => setShowMobileSearch(true)}
              >
                <Search sx={{ fontSize: 21 }} />
              </IconButton>

              <IconButton
                className="h-10 w-10 border border-slate-200 bg-white"
                aria-label={customerName ? "Open profile" : "Login"}
                onClick={handleAccountNavigation}
              >
                <AccountCircle sx={{ fontSize: 22 }} />
              </IconButton>
            </div>
          ) : null}
        </div>
      </div>

      <div
        className={`mobile-category-rail overflow-hidden border-b border-gray-200 bg-white transition-[max-height,opacity,transform] duration-300 ease-out lg:hidden ${
          isMobileNavCondensed
            ? "max-h-0 -translate-y-2 opacity-0"
            : "max-h-24 translate-y-0 opacity-100"
        }`}
      >
        <div className="flex items-stretch gap-1.5 overflow-x-auto px-3 pt-2">
          {mobileCategoryItems.map((item) => {
            const isActive = item.categoryid
              ? location.pathname === `/products/${item.categoryid}`
              : location.pathname === "/" || location.pathname === "/products";

            return (
              <button
                key={`${item.name}-${item.categoryid || "all"}`}
                type="button"
                onClick={() =>
                  item.categoryid
                    ? handleMainCategoryClick(item.categoryid)
                    : navigate("/products")
                }
                className={`mobile-category-item flex min-w-18.5 flex-col items-center gap-1 border-b-[3px] px-2 pb-2 text-xs font-medium transition-all duration-300 ease-out ${
                  isActive
                    ? "border-teal-600 text-slate-950"
                    : "border-transparent text-slate-700"
                }`}
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-300 ease-out ${
                    isActive
                      ? "border-teal-100 bg-teal-50"
                      : "border-slate-100 bg-white"
                  }`}
                >
                  <Storefront sx={{ fontSize: 22, color: isActive ? "#0f766e" : "#111827" }} />
                </span>
                <span className="max-w-17.5 truncate leading-tight">{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="hidden border-b border-gray-200 px-4 py-3 sm:px-6 lg:block lg:px-20">
        <div className="flex items-center justify-between gap-3 lg:flex-nowrap lg:justify-start lg:gap-2 xl:gap-4">
          <div className="flex min-w-0 items-center gap-3 lg:flex-1 lg:gap-4 xl:gap-7">
            <div className="flex min-w-0 items-center gap-2">
              <IconButton
                className="lg:hidden"
                aria-label="Open categories"
                onClick={() => setShowMobileMenu(true)}
              >
                <Menu className="text-gray-700" sx={{ fontSize: 29 }} />
              </IconButton>
              <h1
                onClick={() => navigate("/")}
                className="logo cursor-pointer text-lg text-shadow-lg md:text-2xl"
              >
                GrowLine
              </h1>
            </div>
            <ul className="hidden items-center font-medium text-gray-800 lg:flex lg:text-sm xl:text-base">
              {mainCategory.map((item) => (
                <li
                  onMouseEnter={() => {
                    setShowSheet(true);
                    setSelectedCategory(item.categoryid);
                  }}
                  onClick={() => handleMainCategoryClick(item.categoryid)}
                  key={item.categoryid}
                  className="mainCategory flex h-16 cursor-pointer items-center px-2 hover:border-b-2 hover:text-teal-600 xl:px-4"
                >
                  {item.name}
                </li>
              ))}
            </ul>
          </div>

          <form
            onSubmit={handleSearchFormSubmit}
            className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 lg:flex lg:w-48 xl:w-64 2xl:w-80"
          >
            <Search sx={{ fontSize: 22, color: "#64748b" }} />
            <InputBase
              placeholder="Search products"
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              inputProps={{
                "aria-label": "Search products",
                autoComplete: "off",
                enterKeyHint: "search",
              }}
              sx={{ fontSize: 14, width: "100%" }}
            />
          </form>

          <div className="hidden items-center gap-1 lg:flex lg:flex-nowrap xl:gap-2">
            {customerName ? (
              <Button
                onClick={() => navigate("/customer/profile")}
                className="min-w-0 gap-2 rounded-full px-2 py-1 text-slate-700"
                sx={{ textTransform: "none" }}
              >
                <Avatar
                  src={optimizeImageUrl("https://plus.unsplash.com/premium_photo-1682090778813-3938ba76ee57?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW5kaWFuJTIwZ3Jvb218ZW58MHx8MHx8fDA%3D", { width: 58, height: 58, fit: "crop" })}
                  sx={{ width: 32, height: 32 }}
                />
                <span className="hidden max-w-32 truncate text-sm font-medium xl:block">
                  {customerName}
                </span>
              </Button>
            ) : (
              <Button
                variant="contained"
                startIcon={<AccountCircle />}
                onClick={() => navigate("/login")}
                sx={{
                  borderRadius: "999px",
                  minWidth: 0,
                  px: 2,
                  textTransform: "none",
                  whiteSpace: "nowrap",
                }}
              >
                Login
              </Button>
            )}
            <IconButton
              onClick={() => navigate("/wishlist")}
              className="rounded-full border border-slate-200 bg-white"
            >
              <Badge badgeContent={wishlistItemCount} color="secondary">
                <FavoriteBorder sx={{ fontSize: 24 }} />
              </Badge>
            </IconButton>
            <IconButton
              onClick={() => navigate("/cart")}
              className="rounded-full border border-slate-200 bg-white"
            >
              <Badge badgeContent={cartItemCount} color="primary">
                <AddShoppingCart sx={{ fontSize: 24 }} />
              </Badge>
            </IconButton>
            <Button
              variant="contained"
              startIcon={<Storefront />}
              onClick={() => navigate("/become-seller")}
              sx={{
                display: { xs: "none", xl: "inline-flex" },
                borderRadius: "999px",
                px: 2.5,
                py: 1.1,
                textTransform: "none",
                whiteSpace: "nowrap",
                boxShadow: "none",
                backgroundColor: "#f97316",
                "&:hover": {
                  backgroundColor: "#ea580c",
                  boxShadow: "none",
                },
              }}
            >
              Sell on GrowLine
            </Button>
          </div>
        </div>
      </div>

      <Drawer
        anchor="left"
        open={showMobileMenu}
        onClose={() => setShowMobileMenu(false)}
        PaperProps={{
          sx: {
            width: "min(85vw, 320px)",
          },
        }}
      >
        <Box className="flex h-full flex-col bg-slate-50">
          <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                Browse
              </p>
              <h2 className="mt-1 text-lg font-semibold text-slate-900">Categories</h2>
            </div>
            <IconButton aria-label="Close categories" onClick={() => setShowMobileMenu(false)}>
              <Close />
            </IconButton>
          </div>
          <div className="flex flex-col gap-3 p-4">
            <form
              onSubmit={(event) => {
                handleSearchFormSubmit(event);
                setShowMobileMenu(false);
              }}
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2"
            >
              <Search sx={{ fontSize: 20, color: "#64748b" }} />
              <InputBase
                placeholder="Search products"
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                inputProps={{
                  "aria-label": "Search products",
                  autoComplete: "off",
                  enterKeyHint: "search",
                }}
                sx={{ fontSize: 14, width: "100%" }}
              />
            </form>

            {customerName ? (
              <Button
                onClick={() => {
                  navigate("/customer/profile");
                  setShowMobileMenu(false);
                }}
                className="justify-start gap-2 rounded-full px-2 py-1 text-slate-700"
                sx={{ textTransform: "none" }}
              >
                <Avatar
                  src={optimizeImageUrl("https://plus.unsplash.com/premium_photo-1682090778813-3938ba76ee57?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW5kaWFuJTIwZ3Jvb218ZW58MHx8MHx8fDA%3D", { width: 58, height: 58, fit: "crop" })}
                  sx={{ width: 32, height: 32 }}
                />
                <span className="max-w-48 truncate text-sm font-medium">{customerName}</span>
              </Button>
            ) : (
              <Button
                variant="contained"
                startIcon={<AccountCircle />}
                onClick={() => {
                  navigate("/login");
                  setShowMobileMenu(false);
                }}
                sx={{
                  borderRadius: "999px",
                  minWidth: 0,
                  px: 2,
                  textTransform: "none",
                  whiteSpace: "nowrap",
                }}
              >
                Login
              </Button>
            )}

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outlined"
                startIcon={<FavoriteBorder />}
                onClick={() => {
                  navigate("/wishlist");
                  setShowMobileMenu(false);
                }}
                sx={{ borderRadius: "999px", textTransform: "none" }}
              >
                Wishlist ({wishlistItemCount})
              </Button>
              <Button
                variant="outlined"
                startIcon={<AddShoppingCart />}
                onClick={() => {
                  navigate("/cart");
                  setShowMobileMenu(false);
                }}
                sx={{ borderRadius: "999px", textTransform: "none" }}
              >
                Cart ({cartItemCount})
              </Button>
            </div>

            <Button
              variant="contained"
              startIcon={<Storefront />}
              onClick={() => {
                navigate("/become-seller");
                setShowMobileMenu(false);
              }}
              sx={{
                borderRadius: "999px",
                px: 2.5,
                py: 1.1,
                textTransform: "none",
                whiteSpace: "nowrap",
                boxShadow: "none",
                backgroundColor: "#f97316",
                "&:hover": {
                  backgroundColor: "#ea580c",
                  boxShadow: "none",
                },
              }}
            >
              Sell on GrowLine
            </Button>

            <Button
              variant="outlined"
              onClick={() => {
                setShowMobileMenu(false);
                navigate("/products");
              }}
              sx={{
                justifyContent: "flex-start",
                borderRadius: "18px",
                px: 2,
                py: 1.5,
                textTransform: "none",
              }}
            >
              View all products
            </Button>
            {mainCategory.map((item) => (
              <button
                key={item.categoryid}
                type="button"
                onClick={() => handleMainCategoryClick(item.categoryid)}
                className="flex w-full items-center justify-between rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-left text-slate-800 shadow-sm transition hover:border-teal-200 hover:bg-teal-50"
              >
                <span className="font-medium">{item.name}</span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-400">
                  Shop
                </span>
              </button>
            ))}
          </div>
        </Box>
      </Drawer>

      {showSheet ? (
        <Box className="categorySheet absolute left-20 right-20 top-full z-130 hidden lg:block">
          <Suspense fallback={null}>
            <LazyCategorySheet
              selectedCategory={selectedCategory}
              onNavigate={() => setShowSheet(false)}
            />
          </Suspense>
        </Box>
      ) : null}
    </Box>
  );
};
