import { Divider } from "@mui/material";
import { Order } from "./Order";
import { OrderDetails } from "./OrderDetails";

const menu=[
 {name:"Orders",link:"/customer/orders"},
 {name:"Profile",link:"/customer/profile"},
 {name:"Addresses",link:"/customer/addresses"},
 {name:"Payment Methods",link:"/customer/payment-methods"},
 {name:"Logout",link:"/logout"},
]

export const Profile = () => {
    // const location = useLocation();
  return (
    <div className="px-5 lg:px-52 min-h-screen mt-10">
      <div>
        <h1 className="text-xl font-bold pb-5">Profile</h1>
      </div>
      <Divider />
      <div className="grid grid-cols-2 lg:grid-cols-3 lg:min-h-[78vh]">
        <div className="col-span-1 lg:border-r border-gray-200 lg:pr-5 py-5 h-full flex flex-row flex-wrap lg:flex-col gap-3">
            {menu.map((item,index)=><div className={`${index===0?"bg-teal-50 border-l-4 border-teal-500":""} p-3 cursor-pointer`} key={item.link}><p>{item.name}</p></div>)}
        </div>
        <div className="lg:col-span-2 lg:pl-5 py-5">
            {/* <Order /> */}
            <OrderDetails />
        </div>
      </div>
    </div>
  );
};
