import {
  AccountBalanceWallet,
  AccountBox,
  Add,
  Dashboard,
  Inventory,
  Logout,
  Receipt,
  ShoppingBag,
} from "@mui/icons-material";
import { Divider, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { useLocation, useNavigate } from "react-router";

const menu = [
  {
    name: "Dashboard",
    icon: <Dashboard className="text-teal-700" />,
    path: "/seller/dashboard",
    activeIcon: <Dashboard className="text-white" />,
  },
  {
    name: "Orders",
    icon: <ShoppingBag className="text-teal-700" />,
    path: "/seller/orders",
    activeIcon: <ShoppingBag className="text-white" />,
  },
  {
    name: "Products",
    icon: <Inventory className="text-teal-700" />,
    path: "/seller/products",
    activeIcon: <Inventory className="text-white" />,
  },
  {
    name: "Add Product",
    icon: <Add className="text-teal-700" />,
    path: "/seller/add-product",
    activeIcon: <Add className="text-white" />,
  },
  {
    name: "Payments",
    icon: <AccountBalanceWallet className="text-teal-700" />,
    path: "/seller/payments",
    activeIcon: <AccountBalanceWallet className="text-white" />,
  },
  {
    name: "Transactions",
    icon: <Receipt className="text-teal-700" />,
    path: "/seller/transactions",
    activeIcon: <Receipt className="text-white" />,
  },
];

const menu2 = [
  {
    name: "Account",
    icon: <AccountBox className="text-teal-700" />,
    path: "/seller/account",
    activeIcon: <AccountBox className="text-white" />,
  },
  {
    name: "Logout",
    icon: <Logout className="text-teal-700" />,
    path: "/",
    activeIcon: <Logout className="text-white" />,
  },
];

export const SellerDrawwerList = ({ toggleDrawwer }: any) => {
  const location = useLocation();
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("sellerToken");
    if (toggleDrawwer) toggleDrawwer(false);
    navigate("/seller/login");
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
            <Divider className="py-30"/>
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
