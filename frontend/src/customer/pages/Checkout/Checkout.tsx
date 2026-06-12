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
import { clearCartState, fetchCart } from "../../../Redux Toolkit/featurs/coustomer/cartSlice";
import { createOrder } from "../../../Redux Toolkit/featurs/coustomer/orderSlice";
import {
  buildWishlistUserKey,
  removeManyFromWishlist,
} from "../../../Redux Toolkit/featurs/coustomer/wishlistSlice";
import { useNavigate } from "react-router";
import {
  clearPurchasedProductIds,
  persistPurchasedProductIds,
} from "../../../util/purchaseSession";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "min(92vw, 500px)", sm: 500 },
  bgcolor: "background.paper",
  // border: '2px solid #000',
  boxShadow: 24,
  p: { xs: 2, sm: 4 },
};

const paymentGatwayList = [
  {
    label: "Razorpay",
    value: "razorpay",
  },
  {
    label: "Cash on Delivery",
    value: "cod",
  },
];

export const Checkout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [paymentGateway,setPaymentGateway] = useState(paymentGatwayList[0].value);
  const { cart, auth, user, order } = useAppSelector((state) => state);
  const wishlistUserKey = buildWishlistUserKey(auth.user, user.user);
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
    const purchasedProductIds = (cart.cart?.items || [])
      .map((item: any) => item?.productId || item?.product?._id)
      .filter(Boolean)
      .map((productId: any) => String(productId));

    persistPurchasedProductIds(purchasedProductIds);

    try {
      const result = await dispatch(
        createOrder({
          address: selectedAddressData,
          jwt,
          paymentGateway,
        }),
      ).unwrap();

      const paymentLink = result?.paymentDetails?.paymentLink;

      if (paymentLink) {
        window.location.href = paymentLink;
        return;
      }

      dispatch(
        removeManyFromWishlist({
          userKey: wishlistUserKey,
          productIds: purchasedProductIds,
        }),
      );
      dispatch(clearCartState());
      await dispatch(fetchCart(jwt));
      clearPurchasedProductIds();

      navigate("/customer/profile/orders", { replace: true });
    } catch (error: any) {
      clearPurchasedProductIds();
      setCheckoutError(error?.message || error?.error || "Unable to place order");
    }
  };

  const handleChangePaymentGateway = (event: any) => {
    setPaymentGateway(event.target.value);
  }
  return (
    <div className="min-h-screen px-4 pb-10 pt-6 sm:px-6 md:px-10 lg:px-20 xl:px-28">
      <div className="space-y-5 lg:grid lg:grid-cols-3 lg:gap-9 lg:space-y-0">
        <div className="col-span-2 space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-xl font-semibold sm:text-2xl">
              Select Delivery Address
            </span>
            <Button onClick={handleOpen} variant="outlined" fullWidth className="sm:w-auto">
              Add New Address
            </Button>
          </div>
          <div className="text-sm font-medium space-y-5">
            <p>Saved Adreess</p>
            <div className="border p-4 rounded-md border-gray-400 space-y-4 sm:p-5 sm:space-y-5">
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
            <div className="mb-4 rounded-md border border-gray-300 px-4 py-4 sm:px-5">
              <Button
                onClick={handleOpen}
                variant="contained"
                startIcon={<Add />}
                fullWidth
                className="sm:w-auto"
              >
                Add new Address
              </Button>
            </div>
            {checkoutError ? (
              <Alert severity="error">{checkoutError}</Alert>
            ) : null}
          </div>
        </div>
        <div className="col-span-1 h-fit space-y-3 rounded-md border border-gray-300 p-4 text-sm sm:p-5">
          <section className="space-y-3 rounded-md border border-gray-300 p-4 sm:p-5">
            <h1 className="pb-2 text-center font-medium text-teal-600">
              Choose Payment Method
            </h1>
            <RadioGroup
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              value={paymentGateway}
              onChange={handleChangePaymentGateway}
              sx={{ flexDirection: { xs: "column", sm: "row" }, gap: 0.5 }}
            >
              {paymentGatwayList.map((item)=><FormControlLabel
                key={item.value}
                value={item.value}
                control={<Radio />}
                label={item.label}
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
                {order.loading ? "Processing..." : paymentGateway === "cod" ? "Place Order" : "Pay Now"}
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
