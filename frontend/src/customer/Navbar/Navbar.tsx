import { useEffect, useState } from "react";
import {
  AccountCircle,
  AddShoppingCart,
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
  InputBase,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import "./Navbar.css";
import mainCategory from "../../data/category/mainCategory";
import { CategorySheet } from "./Category";
import { useLocation, useNavigate } from "react-router";
import { useAppSelector } from "../../Redux Toolkit/store";
export const Navbar = () => {
  const {user, cart, wishlist}=useAppSelector((state)=>state);
  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up("lg"));
  const [showSheet, setShowSheet] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("menu");
  const cartItemCount = cart.cart?.totalItems || 0;
  const wishlistItemCount = wishlist.items?.length || 0;
  // const[isLoggedIn,setIsLoggedIn]=useState(false);
  // const jwt=localStorage.getItem("jwt");
  // if(jwt){
  //   setIsLoggedIn(true);
  // }
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
    navigate(`/products/${categoryId}`);
  };

  return (
    <Box
      onMouseLeave={() => setShowSheet(false)}
      className="sticky top-0 left-0 right-0 bg-white blur-bg bg-opacity-80 z-120"
    >
      <div className="flex items-center justify-between px-5 lg:px-20 h-17.5 border-b border-gray-200">
        <div className="flex items-center gap-9">
          <div className="flex items-center gap-2">
            {!isLarge ? (
              <IconButton>
                <Menu className="text-gray-700" sx={{ fontSize: 29 }} />
              </IconButton>
            ) : null}
            <h1 onClick={()=>navigate("/")} className="logo text-shadow-lg text-lg md:text-2xl cursor-pointer">
              Thok Bazar
            </h1>
          </div>
          <ul className="flex items-center font-medium text-gray-800">
            {mainCategory.map((item) => (
              <li
                onMouseEnter={() => {
                  setShowSheet(true);
                  setSelectedCategory(item.categoryid);
                }}
                onClick={() => handleMainCategoryClick(item.categoryid)}
                key={item.categoryid}
                className="mainCategory hover:text-teal-600 cursor-pointer hover:border-b-2 h-17 px-4 border[#00927] flex items-center"
              >
                {item.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center gap-5">
          <div className="hidden md:flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
            <Search sx={{ fontSize: 22, color: "#64748b" }} />
            <InputBase
              placeholder="Search products"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleSearchSubmit();
                }
              }}
              sx={{ fontSize: 14, width: { md: 180, lg: 260 } }}
            />
          </div>
          <IconButton onClick={handleSearchSubmit}>
            <Search sx={{ fontSize: 29 }} />
          </IconButton>
          {user.user?.name ? (
            <Button onClick={()=>navigate("/customer/profile")} className="flex item-center gap-1">
              <Avatar
                src="https://plus.unsplash.com/premium_photo-1682090778813-3938ba76ee57?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW5kaWFuJTIwZ3Jvb218ZW58MHx8MHx8fDA%3D"
                sx={{ width: 29, height: 29 }}
              />
              <h1>{user.user?.name}</h1>
            </Button>
          ) : (
            <Button variant="contained" startIcon={<AccountCircle />} onClick={()=>navigate('/login')}>
              Login
            </Button>
          )}
          <IconButton onClick={()=>navigate("/wishlist")}>
            <Badge badgeContent={wishlistItemCount} color="secondary">
              <FavoriteBorder sx={{ fontSize: 29 }} />
            </Badge>
          </IconButton>
          <IconButton onClick={()=>navigate("/cart")}>
            <Badge badgeContent={cartItemCount} color="primary">
              <AddShoppingCart sx={{ fontSize: 29 }} />
            </Badge>
          </IconButton>
          <Button
            variant="contained"
            startIcon={<Storefront />}
            className="ml-3 bg-orange-500 hover:bg-orange-600"
            onClick={()=>navigate("/become-seller")}
          >
            Sell on Thok Bazar
          </Button>
        </div>
      </div>
      {showSheet && isLarge && (
        <Box
          className="categorySheet absolute top-[4.4rem] left-20 right-20 z-130"
        >
          <CategorySheet
            selectedCategory={selectedCategory}
            onNavigate={() => setShowSheet(false)}
          />
        </Box>
      )}
    </Box>
  );
};
