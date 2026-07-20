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
import { useState, type ChangeEvent } from "react";
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
import { deleteUserAddress, saveUserAddress } from "../../../Redux Toolkit/featurs/coustomer/userSlice";
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
type CheckoutAddress = { _id?: string; name?: string; mobile?: string; locality?: string; address?: string; city?: string; state?: string; pincode?: string };
type CheckoutCartItem = { productId?: string; product?: { _id?: string } };
const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object") {
    const value = error as { message?: string; error?: string };
    return value.message || value.error || fallback;
  }
  return fallback;
};

export const Checkout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [paymentGateway,setPaymentGateway] = useState(paymentGatwayList[0].value);
  const { cart, auth, user, order } = useAppSelector((state) => state);
  const wishlistUserKey = buildWishlistUserKey(auth.user, user.user);
  const [checkoutError, setCheckoutError] = useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [selectedAddress, setSelectedAddress] = useState("0");

  const savedAddresses: CheckoutAddress[] = Array.isArray(user.user?.address) ? user.user.address : [];

  const addresses = savedAddresses;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedAddress(event.target.value);
  };

  const handleSaveAddress = async (addressPayload: Record<string, string>) => {
    const jwt = auth.jwt?.trim() || localStorage.getItem("jwt") || "";
    try {
      const updatedUser = await dispatch(saveUserAddress({ values: addressPayload, jwt })).unwrap();
      const nextAddresses = Array.isArray(updatedUser?.address) ? updatedUser.address : [];
      setSelectedAddress(String(Math.max(0, nextAddresses.length - 1)));
      setCheckoutError(""); handleClose();
    } catch (error: unknown) {
      setCheckoutError(getErrorMessage(error, "Unable to save address."));
    }
  };

  const handleDeleteAddress = async (indexToDelete: number) => {
    const addressId = savedAddresses[indexToDelete]?._id;
    const jwt = auth.jwt?.trim() || localStorage.getItem("jwt") || "";
    if (!addressId) return;
    try {
      await dispatch(deleteUserAddress({ addressId: String(addressId), jwt })).unwrap();
      setSelectedAddress("0"); setCheckoutError("");
    } catch (error: unknown) {
      setCheckoutError(getErrorMessage(error, "Unable to delete address."));
    }
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
      .map((item: CheckoutCartItem) => item?.productId || item?.product?._id)
      .filter((productId: string | undefined): productId is string => Boolean(productId))
      .map((productId) => String(productId));

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
    } catch (error: unknown) {
      clearPurchasedProductIds();
      setCheckoutError(getErrorMessage(error, "Unable to place order"));
    }
  };

  const handleChangePaymentGateway = (event: ChangeEvent<HTMLInputElement>) => {
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
