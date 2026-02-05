import { useNavigate } from "react-router";
import { OrderItemCart } from "./OrderCart"

export const Order = () => {
    const navigate=useNavigate();
    return(
        <div className="text-sm min-h-screen">
            <div className="pb-5">
                <h1 className="font-semibold">All Orders</h1>
                <p>From anytime</p>
            </div>
            <div
            onClick={()=>navigate("/customer/profile/orders/123/item/456")}
            className="space-y-2">
                {[1,1,1,1].map((item,index)=><OrderItemCart key={index}/>)}
            </div>

        </div>
    )
}