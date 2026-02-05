import React, { useState } from "react";
import {
  AccountCircle,
  AddShoppingCart,
  Favorite,
  FavoriteBorder,
  Menu,
  Search,
  Storefront,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import "./Navbar.css";
import mainCategory from "../../data/category/mainCategory";
import { CategorySheet } from "./Category";
import { useNavigate } from "react-router";
export const Navbar = () => {
  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up("lg"));
  const [showSheet, setShowSheet] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("menu");

  const navigate=useNavigate();
  return (
    <Box className="sticky top-0 left-0 right-0 bg-white blur-bg bg-opacity-80">
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
                onMouseLeave={() => setShowSheet(false)}
                onMouseEnter={() => {
                  setShowSheet(true);
                  setSelectedCategory(item.categoryid);
                }}
                key={item.categoryid}
                className="mainCategory hover:text-teal-600 cursor-pointer hover:border-b-2 h-17 px-4 border[#00927] flex items-center"
              >
                {item.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center gap-5">
          <IconButton>
            <Search sx={{ fontSize: 29 }} />
          </IconButton>
          {true ? (
            <Button onClick={()=>navigate("/customer/profile")} className="flex item-center gap-1">
              <Avatar
                src="https://plus.unsplash.com/premium_photo-1682090778813-3938ba76ee57?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW5kaWFuJTIwZ3Jvb218ZW58MHx8MHx8fDA%3D"
                sx={{ width: 29, height: 29 }}
              />
              <h1>Hims</h1>
            </Button>
          ) : (
            <Button variant="contained" startIcon={<AccountCircle />}>
              Login
            </Button>
          )}
          <IconButton>
            <FavoriteBorder sx={{ fontSize: 29 }} />
          </IconButton>
          <IconButton onClick={()=>navigate("/cart")}>
            <AddShoppingCart sx={{ fontSize: 29 }} />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<Storefront />}
            className="ml-3 bg-orange-500 hover:bg-orange-600"
          >
            Sell on Thok Bazar
          </Button>
        </div>
      </div>
      {showSheet && isLarge && (
        <Box
          onMouseLeave={() => setShowSheet(false)}
          onMouseEnter={() => setShowSheet(true)}
          className="categorySheet absolute top-[4.4rem] left-20 right-20"
        >
          <CategorySheet
            selectedCategory={selectedCategory}
            setShowSheets={setShowSheet}
          />
        </Box>
      )}
    </Box>
  );
};
