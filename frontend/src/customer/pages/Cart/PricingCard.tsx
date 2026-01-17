import { Divider } from "@mui/material"

export const PricingCard = () => {
  return (
    <div className="border border-gray-300 rounded-md">
        <div className="space-y-3 p-5">
            <div className="flex justify-between items-center">
                <span>Subtotal</span>
                <span>₹1200</span>
            </div>
            <div className="flex justify-between items-center">
                <span>Shipping</span>
                <span>+₹100</span>
            </div>
            <div className="flex justify-between items-center">
                <span>Tax</span>
                <span>+₹120</span>
            </div>
            <div className="flex justify-between items-center">
                <span>Platform fee</span>
                <span>+₹120</span>
            </div>
            <div className="flex justify-between items-center">
                <span>Discount</span>
                <span>-₹120</span>
            </div>
            <div className="flex justify-between items-center">
                <span>Coupon Discount</span>
                <span className="text-teal-500">-₹120</span>
            </div>
            <Divider />
            <div className="flex justify-between items-center border-t border-gray-300 pt-3">
               <strong>Total</strong> 
                <span>₹1300</span>
            </div>
        </div>
    </div>
  )
}