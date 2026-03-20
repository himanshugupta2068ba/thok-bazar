import { Alert, Box, CircularProgress } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { api } from "../../../config/api";
import { clearCartState, fetchCart } from "../../../Redux Toolkit/featurs/coustomer/cartSlice";
import {
  buildWishlistUserKey,
  removeManyFromWishlist,
} from "../../../Redux Toolkit/featurs/coustomer/wishlistSlice";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/store";
import {
  clearPurchasedProductIds,
  loadPurchasedProductIds,
} from "../../../util/purchaseSession";

export const PaymentSuccess = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState("");
  const { auth, user } = useAppSelector((state) => state);

  const jwt = useMemo(() => localStorage.getItem("jwt") || "", []);
  const wishlistUserKey = useMemo(
    () => buildWishlistUserKey(auth.user, user.user),
    [auth.user, user.user],
  );

  useEffect(() => {
    const verifyPayment = async () => {
      const paymentId = searchParams.get("razorpay_payment_id");
      const paymentLinkId = searchParams.get("razorpay_payment_link_id");

      if (!jwt) {
        navigate("/login");
        return;
      }

      if (!paymentId || !paymentLinkId) {
        setError("Invalid payment callback details.");
        return;
      }

      try {
        const response = await api.get(`/payments/success`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          params: {
            razorpay_payment_id: paymentId,
            razorpay_payment_link_id: paymentLinkId,
          },
        });

        const orderId = response.data?.orderId;
        const purchasedProductIds = loadPurchasedProductIds();

        if (purchasedProductIds.length) {
          dispatch(
            removeManyFromWishlist({
              userKey: wishlistUserKey,
              productIds: purchasedProductIds,
            }),
          );
        }

        dispatch(clearCartState());
        await dispatch(fetchCart(jwt));
        clearPurchasedProductIds();

        if (orderId) {
          navigate(`/customer/profile/orders/${orderId}`, { replace: true });
          return;
        }

        navigate("/customer/profile/orders", { replace: true });
      } catch (requestError: any) {
        setError(requestError?.response?.data?.message || "Payment verification failed.");
      }
    };

    verifyPayment();
  }, [dispatch, jwt, navigate, searchParams, wishlistUserKey]);

  return (
    <Box className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-md border border-gray-200 bg-white p-6 text-center space-y-4">
        <CircularProgress />
        <h1 className="text-lg font-semibold">Verifying payment...</h1>
        <p className="text-sm text-gray-500">
          Please wait while we confirm your payment and prepare your order tracking.
        </p>
        {error ? <Alert severity="error">{error}</Alert> : null}
      </div>
    </Box>
  );
};
