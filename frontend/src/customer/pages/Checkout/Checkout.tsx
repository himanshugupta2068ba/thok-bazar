import {
  Alert,
  Box,
  Button,
  FormControlLabel,
  Modal,
  Radio,
  RadioGroup,
} from "@mui/material";
import { AddressCard } from "./AddressCard";
import { Add } from "@mui/icons-material";
import { useMemo, useState } from "react";
import { AddressForm } from "./AddressForm";
import React from "react";
import { PricingCard } from "../Cart/PricingCard";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/store";
import { createOrder } from "../../../Redux Toolkit/featurs/coustomer/orderSlice";
import { useNavigate } from "react-router";

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
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [paymentGateway,setPaymentGateway] = useState(paymentGatwayList[0].name);
  const { cart, auth, user, order } = useAppSelector((state) => state);
  const [addedAddresses, setAddedAddresses] = useState<any[]>([]);
  const [removedSavedAddressIds, setRemovedSavedAddressIds] = useState<string[]>([]);
  const [checkoutError, setCheckoutError] = useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [selectedAddress, setSelectedAddress] = useState("0");

  const savedAddresses = useMemo(
    () =>
      (Array.isArray(user.user?.address) ? user.user.address : []).filter(
        (address: any) => !removedSavedAddressIds.includes(String(address?._id)),
      ),
    [removedSavedAddressIds, user.user?.address],
  );

  const addresses = useMemo(
    () => [...savedAddresses, ...addedAddresses],
    [addedAddresses, savedAddresses],
  );

  const handleChange = (event: any) => {
    setSelectedAddress(event.target.value);
  };

  const handleSaveAddress = (addressPayload: any) => {
    setAddedAddresses((prev) => [...prev, addressPayload]);
    setSelectedAddress(String(addresses.length));
    setCheckoutError("");
    handleClose();
  };

  const handleDeleteAddress = (indexToDelete: number) => {
    if (indexToDelete < savedAddresses.length) {
      const addressId = savedAddresses[indexToDelete]?._id;
      if (addressId) {
        setRemovedSavedAddressIds((prev) => [...prev, String(addressId)]);
      }
    } else {
      const addedIndex = indexToDelete - savedAddresses.length;
      setAddedAddresses((prev) => prev.filter((_, index) => index !== addedIndex));
    }

    setSelectedAddress("0");
  };

  const handleCheckout = async () => {
    const jwt = auth.jwt?.trim() || localStorage.getItem("jwt");

    if (!jwt) {
      navigate("/login");
      return;
    }

    const selectedAddressData = addresses[Number(selectedAddress)];

    if (!selectedAddressData) {
      setCheckoutError("Please select or add a delivery address.");
      return;
    }

    setCheckoutError("");

    try {
      const result = await dispatch(
        createOrder({
          address: selectedAddressData,
          jwt,
          paymentGateway: paymentGateway.toLowerCase(),
        }),
      ).unwrap();

      const paymentLink = result?.paymentDetails?.paymentLink;

      if (paymentLink) {
        window.location.href = paymentLink;
        return;
      }

      navigate("/customer/profile/orders", { replace: true });
    } catch (error: any) {
      setCheckoutError(error?.message || error?.error || "Unable to place order");
    }
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
              {addresses.length ? addresses.map((item, index) => (
                <AddressCard
                  value={index}
                  selectedValue={selectedAddress}
                  handleChange={handleChange}
                  onDelete={handleDeleteAddress}
                  item={item}
                  key={index}
                />
              )) : (
                <p className="text-gray-500">No saved addresses yet. Add a new address to continue.</p>
              )}
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
            {checkoutError ? (
              <Alert severity="error">{checkoutError}</Alert>
            ) : null}
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
            <PricingCard cart={cart.cart} />
            <div className="pt-5">
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleCheckout}
                disabled={order.loading || !cart.cart?.totalItems}
              >
                {order.loading ? "Processing..." : "Pay Now"}
              </Button>
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
          <AddressForm onSave={handleSaveAddress} onCancel={handleClose} />
        </Box>
      </Modal>
    </div>
  );
};
