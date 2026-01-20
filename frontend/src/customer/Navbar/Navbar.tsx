import React, { useState } from "react";
import { Menu } from "@mui/icons-material";
import { Box, IconButton, useMediaQuery, useTheme } from "@mui/material";
import "./Navbar.css";
import mainCategory from "../../data/category/mainCategory";
import { CategorySheet } from "./Category";
export const Navbar = () => {
  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up("lg"));
  const [showSheet,setShowSheet]=useState(false);
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
            <h1 className="logo text-shadow-lg text-lg md:text-2xl">
              Thok Bazar
            </h1>
          </div>
          <ul className="flex items-center font-medium text-gray-800">
            {mainCategory.map((item) => (
              <li 
              onMouseLeave={()=>setShowSheet(false)}
                onMouseEnter={()=>setShowSheet(true)}
        
              key={item.categoryid} className="mainCategory hover:text-teal-600 cursor-pointer hover:border-b-2 h-17 px-4 border[#00927] flex items-center">
                {item.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {showSheet && isLarge && (
        <Box className="w-full h-40 bg-white border-b border-gray-200 shadow-md flex items-center justify-center">
          <CategorySheet />
        </Box>
      )}
    </Box>
  );
};
