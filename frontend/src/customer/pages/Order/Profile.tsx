import { Divider } from "@mui/material";
import { Order } from "./Order";
import { OrderDetails } from "./OrderDetails";
import { Route, Routes, useNavigate } from "react-router";
import { UserProfile } from "../account/UserProfile";
import { Addresses } from "./Addresses";
import { PaymentMethods } from "../account/PaymentMethods";
import { useAppDispatch } from "../../../Redux Toolkit/store";
import { logout } from "../../../Redux Toolkit/featurs/Auth/authSlice";
import { clearCartState } from "../../../Redux Toolkit/featurs/coustomer/cartSlice";
import { resetOrderState } from "../../../Redux Toolkit/featurs/coustomer/orderSlice";
import { resetUserState } from "../../../Redux Toolkit/featurs/coustomer/userSlice";
import { resetWishlistState } from "../../../Redux Toolkit/featurs/coustomer/wishlistSlice";
import { SoftPageBackground } from "../../../common/SoftPageBackground";

const menu = [
  { name: "Orders", link: "/customer/profile/orders" },
  { name: "Profile", link: "/customer/profile" },
  { name: "Addresses", link: "/customer/profile/addresses" },
  { name: "Payment Methods", link: "/customer/profile/payment-methods" },
  { name: "Logout", link: "/logout" },
];

export const Profile = () => {
  const navigate=useNavigate();
  const dispatch = useAppDispatch();
  const handleLogout = () => {
    dispatch(logout());
    dispatch(resetUserState());
    dispatch(clearCartState());
    dispatch(resetOrderState());
    dispatch(resetWishlistState());
    navigate("/", { replace: true });
  };

  const handleCLick=(link:string)=>{
    if(link==="/logout"){
      handleLogout();
    }else{
      navigate(link);
    }
  }
  // const location = useLocation();
  return (
    <SoftPageBackground className="min-h-screen mt-10">
      <div className="px-5 lg:px-52 py-6">
        <div>
          <h1 className="text-xl font-bold pb-5">Profile</h1>
        </div>
        <Divider />
        <div className="grid grid-cols-2 lg:grid-cols-3 lg:min-h-[78vh]">
          <div className="col-span-1 lg:border-r border-gray-200 lg:pr-5 py-5 h-full flex flex-row flex-wrap lg:flex-col gap-3">
            {menu.map((item) => (
              <div
              onClick={handleCLick.bind(null,item.link)}
                className={`hover:bg-teal-500 p-3 cursor-pointer`}
                key={item.link}
              >
                <p>{item.name}</p>
              </div>
            ))}
          </div>
          <div className="lg:col-span-2 lg:pl-5 py-5">
            <Routes>
              <Route path="/" element={<UserProfile/>} />
              <Route path="orders" element={<Order />} />
              <Route path="orders/:orderId" element={<OrderDetails />} />
              <Route path="addresses" element={<Addresses/>} />
              <Route path="payment-methods" element={<PaymentMethods/>}/>
            </Routes>
            {/* <Order /> */}
            {/* <OrderDetails /> */}
          </div>
        </div>
      </div>
    </SoftPageBackground>
  );
};
