import {
  Box,
  Button,
  FormControlLabel,
  Modal,
  Radio,
  RadioGroup,
} from "@mui/material";
import { AddressCard } from "./AddressCard";
import { Add } from "@mui/icons-material";
import { useState } from "react";
import { AddressForm } from "./AddressForm";
import React from "react";
import { PricingCard } from "../Cart/PricingCard";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  // border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const paymentGatwayList = [
  {
    name: "Razorpay",
  },
  {
    name: "Paytm",
  },
];

export const Checkout = () => {
  const [open, setOpen] = React.useState(false);
  const [paymentGateway,setPaymentGateway] = useState(paymentGatwayList[0].name);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [selectedAddress, setSelectedAddress] = useState(0);

  const handleChange = (event: any) => {
    setSelectedAddress(event.target.value);
  };

  const handleChangePaymentGateway = (event: any) => {
    setPaymentGateway(event.target.value);
  }
  return (
    <div className="pt-10 px-5 s:px-10 md:px-44 lg:px-60 min-h-screen">
      <div className="space-y-5 lg:space-y-0 lg:grid grid-cols-3 lg:gap-9">
        <div className="col-span-2 space-y-5">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-semibold">
              Select Delivery Address
            </span>
            <Button onClick={handleOpen} variant="outlined">
              Add New Address
            </Button>
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
              <Button
                onClick={handleOpen}
                variant="contained"
                startIcon={<Add />}
              >
                Add new Address
              </Button>
            </div>
          </div>
        </div>
        <div className="col-span-1 border p-5 rounded-md border-gray-300 text-sm space-y-3 h-fit">
          <section className="space-y-3 border p-5 rounded-md border-gray-300">
            <h1 className="text-teal-600 font-medium pb-2 text-center ">
              Choose Payment Method
            </h1>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              value={paymentGateway}
              onChange={handleChangePaymentGateway}
            >
              {paymentGatwayList.map((item)=><FormControlLabel
                value={item.name}
                control={<Radio />}
                label={item.name}
              />)}
            </RadioGroup>
          </section>
          <section>
            <PricingCard />
            <div className="pt-5">
              <Button fullWidth variant="contained" color="primary">Checkout</Button>
            </div>
          </section>
        </div>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <AddressForm />
        </Box>
      </Modal>
    </div>
  );
};
