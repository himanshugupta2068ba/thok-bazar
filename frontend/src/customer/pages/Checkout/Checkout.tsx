import { Button } from "@mui/material";
import { AddressCard } from "./AddressCard";
import { Add } from "@mui/icons-material";
import { useState } from "react";

export const Checkout = () => {
  const [selectedAddress, setSelectedAddress] = useState(0);

  const handleChange = (event: any) => {
    setSelectedAddress(event.target.value);
  };

  return (
    <div className="pt-10 px-5 s:px-10 md:px-44 lg:px-60 min-h-screen">
      <div className="space-y-5 lg:space-y-0 lg:grid grid-cols-3 lg:gap-9">
        <div className="col-span-2 space-y-5">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-semibold">
              Select Delivery Address
            </span>
            <Button variant="outlined">Add New Address</Button>
          </div>
          <div className="text-sm font-medium space-y-5">
            <p>Saved Adreess</p>
            <div className="border p-5 rounded-md border-gray-400 space-y-5">
              {[1, 2, 3, 4, 5].map((item, index) => (
                <AddressCard
                  value={index}
                  selectedValue={selectedAddress}
                  handleChange={handleChange}
                  key={index}
                />
              ))}
            </div>
            <div className="py-4 px-5 rounded-md border border-gray-300 mb-4">
              <Button variant="contained" startIcon={<Add />}>
                Add new Address
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
