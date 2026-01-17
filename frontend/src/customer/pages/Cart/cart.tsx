import { Favorite, LocalOffer } from "@mui/icons-material";
import { CartItemCard } from "./cartItemCard";
import { Button, TextField } from "@mui/material";
import { PricingCard } from "./PricingCard";

export const Cart = () => {
  return (
    <div className="pt-10 px-5 sm:px-10 md:px-60 min-h-screen pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-3">
          {[1, 1, 1, 1, 1, 1, 1].map(() => (
            <CartItemCard />
          ))}
        </div>
        {/* <div className="col-span-1 text-sm space-y-3 border border-gray-300 rounded-md p-4"></div> */}
        <div className="col-span-1 text-sm space-y-3">
            <div className="border border-gray-300 rounded-md px-5 py-3 space-y-5">
                <div>
                    <div className="flex gap-3 text-sm items-center">
                        <LocalOffer className="text-teal-600"/>
                        <h1 className="font-semibold text-teal-600">Apply Coupon</h1>
                    </div>
                    <div className="flex justify-between items-center py-4">
                        <TextField size="small" label="Enter Coupon Code" variant="outlined" className="w-full mt-3"/>
                        <button className="bg-teal-400 text-white px-5 py-2 ml-3 rounded-md hover:bg-teal-700">Apply</button>
                    </div>
                    <section className="border border-gray-300 rounded-md">
                        <PricingCard/>
                        <div className="p-5">
                            <Button variant="contained" className="bg-teal-600 w-full hover:bg-teal-800">Proceed to Checkout</Button>
                        </div>
                    </section>
                    <div className="mt-2 border border-gray-300 rounded-md px-5 py-4 flex justify-between iyes-center cursor pointer">
                        <span>Add from Wishlist</span>
                    <Favorite color="primary"/>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
