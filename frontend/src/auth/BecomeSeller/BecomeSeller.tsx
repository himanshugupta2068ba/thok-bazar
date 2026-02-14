import { useState } from "react";
import { SellerAccountForm } from "./SellerAcountForm";
import { SellerLogin } from "./SellerLogin";
import { Button } from "@mui/material";

export const BecomeSeller = () => {
    const[isloggedIn,setIsLoggedIn]=useState(false);
  return (
   <div className="grid md:gap-10 grid-cols-3 min-h-screen">
    <section className="lg:col-span-1 md:col-span-2 col-span-3 shadow-lg rounded-b-md ml-3">
 {
    isloggedIn ? <SellerAccountForm/> : <SellerLogin/>
 }
 <div className="mt-10 space-y-2 mb-10">
    <h1 className="text-center text-sm font-medium">
         {isloggedIn ? "Have an account" : "Not have an Account"}
    </h1>
    <Button sx={{py:"12px"}}
        fullWidth
        variant="outlined"
        onClick={()=>setIsLoggedIn(!isloggedIn)}
    >
        {isloggedIn ? "Login" : "Create Account"}
    </Button>
 </div>
    </section>
    <section className="hidden md:block md:col-span-1 lg:col-span-2">
        <div className="flex items-center justify-between min-h-screen">
            <img className="" src="BecomeSeller.png" alt="seller"/>
        </div>
    </section>
   </div>
  )
}