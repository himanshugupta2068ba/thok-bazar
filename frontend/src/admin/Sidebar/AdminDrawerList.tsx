import {
  AccountBalanceWallet,
  AccountBox,
  Add,
  Category,
  Dashboard,
  FlashOn,
  Home,
  Inventory,
  Logout,
  Person,
  Receipt,
  ShoppingBag,
} from "@mui/icons-material";
import { Divider, Grid, ListItemIcon, ListItemText } from "@mui/material";
import { useLocation, useNavigate } from "react-router";

const menu = [
  {
    name: "Dashboard",
    icon: <Dashboard className="text-teal-700" />,
    path: "/admin",
    activeIcon: <Dashboard className="text-white" />,
  },
//  {
//   name: "Seller Table",
//   icon: <Person className="text-teal-700" />,
//   path: "/admin/seller-table",
//   activeIcon: <Person className="text-white" />,
//  },
 {
  name: "Add Coupon",
  icon: <Add className="text-teal-700" />,
  path: "/admin/add-coupon",
  activeIcon: <Add className="text-white" />,
 },
 {
  name: "Electronics Table",
  icon: <Inventory className="text-teal-700" />,
  path: "/admin/electronics-table",
  activeIcon: <Inventory className="text-white" />,
 },
 {
  name: "Home Grid",
  icon: <Home className="text-teal-700" />,
  path: "/admin/home-grid",
  activeIcon: <Home className="text-white" />,
 },
 {
  name: "Coupon",
    icon: <Receipt className="text-teal-700" />,
  path: "/admin/coupon",
  activeIcon: <Receipt className="text-white" />,
 },
 {
  name: "Shop By Category",
  icon: <Category className="text-teal-700" />,
  path: "/admin/shop-by-category",
  activeIcon: <Category className="text-white" />,
 },
 {
  name: "Deal",
    icon: <FlashOn className="text-teal-700" />,
  path: "/admin/deal",
  activeIcon: <FlashOn className="text-white" />,
 },
];

const menu2 = [
  {
    name: "Account",
    icon: <AccountBox className="text-teal-700" />,
    path: "/admin/account",
    activeIcon: <AccountBox className="text-white" />,
  },
  {
    name: "Logout",
    icon: <Logout className="text-teal-700" />,
    path: "/",
    activeIcon: <Logout className="text-white" />,
  },
];

export const AdminDrawwerList = ({ toggleDrawwer }: any) => {
  const location = useLocation();
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    if (toggleDrawwer) toggleDrawwer(false);
    navigate("/admin/login");
  };

  const handleCLick = (path: string) => {
    if (path === "/") {
      handleLogout();
    } else {
      navigate(path);
    }
    // if (toggleDrawwer) toggleDrawwer(false);
  };
  return (
    <div className="w-75 h-full flex flex-col justify-between border-r border-gray-200 gap-5 py-10">
      <div className="space-y-2">
        {menu.map((item, index) => (
          <div
            key={item.path}
            className="pr-9 cursor-pointer"
            onClick={() => handleCLick(item.path)}
          >
            <p
              className={`flex items-center gap-3 px-5 py-2 rounded-lg ${location.pathname === item.path ? "bg-teal-700 text-white" : "text-gray-700"
                }`}
            
            >
              <ListItemIcon>
                {location.pathname === item.path ? item.activeIcon : item.icon}
              </ListItemIcon>
              <ListItemText primary={item.name} />
            </p>
          </div>
        ))}
      </div>
         <div className="space-y-2">
            <Divider className="py-3"/>
        {menu2.map((item, index) => (
          <div
            key={item.path}
            className="pr-9 cursor-pointer"
            onClick={() => handleCLick(item.path)}
          >
            <p
              className={`flex items-center gap-3 px-5 py-2 rounded-lg ${location.pathname === item.path ? "bg-teal-700 text-white" : "text-gray-700"
                }`}
            
            >
              <ListItemIcon>
                {location.pathname === item.path ? item.activeIcon : item.icon}
              </ListItemIcon>
              <ListItemText primary={item.name} />
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
