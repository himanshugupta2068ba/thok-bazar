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

export const Navbar = () => {
  const customerName = useAppSelector((state) => state.user.user?.name || "");
  const cartItemCount = useAppSelector((state) => state.cart.cart?.totalItems || 0);
  const wishlistItemCount = useAppSelector((state) => state.wishlist.items?.length || 0);
  const [showSheet, setShowSheet] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(mainCategory[0]?.categoryid || "");
  const navigate=useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchTerm(params.get("q") || "");
  }, [location.search]);

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
    navigate(`/products/${categoryId}`);
  };

  const handleSearchFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSearchSubmit();
  };

  return (
    <Box
      onMouseLeave={() => setShowSheet(false)}
      className="sticky top-0 left-0 right-0 z-120 bg-white/90 blur-bg shadow-sm"
    >
      <div className="border-b border-gray-200 px-4 py-3 sm:px-6 lg:px-20">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-3 lg:flex-none lg:gap-9">
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
                Thok Bazar
              </h1>
            </div>
            <ul className="hidden items-center font-medium text-gray-800 lg:flex">
              {mainCategory.map((item) => (
                <li
                  onMouseEnter={() => {
                    setShowSheet(true);
                    setSelectedCategory(item.categoryid);
                  }}
                  onClick={() => handleMainCategoryClick(item.categoryid)}
                  key={item.categoryid}
                  className="mainCategory flex h-17 cursor-pointer items-center px-4 hover:border-b-2 hover:text-teal-600"
                >
                  {item.name}
                </li>
              ))}
            </ul>
          </div>

          <form
            onSubmit={handleSearchFormSubmit}
            className="order-3 flex w-full items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 lg:order-none lg:w-[320px]"
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

          <div className="order-2 flex w-full flex-wrap items-center gap-2 sm:justify-end lg:order-none lg:w-auto lg:flex-nowrap lg:gap-3">
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
                <span className="hidden max-w-[10rem] truncate text-sm font-medium sm:block">
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
                <FavoriteBorder sx={{ fontSize: 26 }} />
              </Badge>
            </IconButton>
            <IconButton
              onClick={() => navigate("/cart")}
              className="rounded-full border border-slate-200 bg-white"
            >
              <Badge badgeContent={cartItemCount} color="primary">
                <AddShoppingCart sx={{ fontSize: 26 }} />
              </Badge>
            </IconButton>
            <Button
              variant="contained"
              startIcon={<Storefront />}
              className="w-full sm:w-auto"
              onClick={() => navigate("/become-seller")}
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
              Sell on Thok Bazar
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
        <Box
          className="categorySheet absolute left-20 right-20 top-full z-130 hidden lg:block"
        >
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
