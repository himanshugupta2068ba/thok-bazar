import { Menu } from "@mui/icons-material";
import { Drawer, IconButton } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";

export const Navbar = ({ DrawerList }: any) => {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const toggleDrawwer = (newOpen: boolean) => {
    setOpen(newOpen);
  };
  return (
    <div className="h-[10vh] flex items-center px-5 border-b border-gray-400">
      <div className="flex items-center gap-3">
        <IconButton onClick={() => toggleDrawwer(true)} color="primary">
          <Menu color="primary" />
        
        </IconButton>
          <h1
            onClick={() => navigate("/")}
            className="logo text-xl cursor-pointer"
          >
            Thok Bazar
          </h1>
      </div>

      <Drawer anchor="left" open={open} onClose={() => toggleDrawwer(false)}>
        <DrawerList toggleDrawwer={toggleDrawwer} />
      </Drawer>
    </div>
  );
};
