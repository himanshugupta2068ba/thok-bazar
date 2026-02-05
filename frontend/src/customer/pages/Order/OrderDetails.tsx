import { Box, Button, Divider } from "@mui/material"
import { OrderStepper } from "./OrderStepper"
import { Payment } from "@mui/icons-material"

export const OrderDetails=()=>{
    return (
        <Box className='space-y-5'>
            <section className="flex flex-col gap-5 justify-center items-center">
                <img className="w-32" src="https://cdn-icons-png.flaticon.com/512/190/190411.png" alt="order placed"/>
                <div className="text-sm space-y-1 text-center">
                    <h1 className="font-bold text-lg">Your order has been placed!</h1>
                    <p>Thank you for shopping with Thok-baxzar.</p>
                    <p>Hello</p>
                </div>
            </section>
  <section className="border border-gray-200 p-5">
    <OrderStepper/>
  </section>
  <section className="border border-gray-200 p-5">
  <h1 className="font-bold pb-3">Delivery Adreess</h1>
  <div className="text-sm space-y-2">
    <div className="flex gap-5 font-medium">
        <p>John Doe </p>
        <Divider orientation="vertical" flexItem />
        <p>+1 234 567 890</p>
    </div>
    <p>123 Main Street</p>
  </div>
  </section>
  <section className="border border-gray-200 p-5">
    <div className="flex gap-5 font-medium">
        <div className="space-y-1">
            <p className="font-semibold">Total item Price</p>
            <p className="pb-3">You saved<span className="text-green-500"> $10.00</span></p>
        </div>
        <p className="text-lg font-bold ml-auto">$90.00</p>
    </div>
    <div className="px-5 py-3 border-t border-gray-200 bg-teal-50">
      <div className="flex justify-between">
       <Payment className="text-teal-500"/>
       <p>Cash on Delivery</p>
      </div>
    </div>
    <Divider/>
   <div className="p-10">
   <Button variant="outlined" color="warning" fullWidth>
    Cancel Order
  </Button>
   </div>
  </section>
        </Box>
    )
}