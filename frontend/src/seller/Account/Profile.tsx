import { Edit } from "@mui/icons-material";
import { Alert, Avatar, Button, CircularProgress, Divider } from "@mui/material";
import { useEffect } from "react";
import { ProfileFieldCart } from "../../customer/pages/account/ProfileFieldCart";
import { fetchSellerProfile } from "../../Redux Toolkit/featurs/seller/sellerSlice";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";

export const Profile = () => {
  const dispatch = useAppDispatch();
  const { profile, loading, error } = useAppSelector((state) => state.sellerData);

  useEffect(() => {
    const sellerJwt = localStorage.getItem("sellerJwt");
    if (sellerJwt) {
      dispatch(fetchSellerProfile(sellerJwt));
    }
  }, [dispatch]);

  const businessDetails = profile?.businessDetails || {};
  const bankDetails = profile?.bankDetails || {};
  const pickupAddress = profile?.pickupAddress || {};

  const maskedAccount = bankDetails.accountNumber
    ? `XXXX XXXX XXXX ${String(bankDetails.accountNumber).slice(-4)}`
    : "-";

  const businessAddress = businessDetails.businessAddress
    || pickupAddress.address
    || "-";

  return (
    <div className="Lg:px-20 pt-5 pb-20 space-y-20 flex justify-center">
      <div className="w-full lg:w-[70%]">
        {loading && (
          <div className="flex justify-center py-10">
            <CircularProgress />
          </div>
        )}

        {!loading && error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <div className="flex items-center pb-3 justify-between">
          <h1 className="font-bold text-2xl">Personal Details</h1>
          <div>
            <Button className="w-16 h-16">
              <Edit />
            </Button>
          </div>
        </div>
        <div>
          <Avatar
            sx={{ width: "10rem", height: "10rem" }}
            src={businessDetails.logo || ""}
          />
          <div>
            <ProfileFieldCart keys={"Seller Name"} value={profile?.sellerName || "-"} />
            <Divider className="my-2" />
            <ProfileFieldCart keys={"Email"} value={profile?.email || "-"} />
            <Divider className="my-2" />
            <ProfileFieldCart keys={"Phone"} value={profile?.mobile || "-"} />

          </div>
        </div>
        <Divider className="my-10" />
        <div className="flex items-center pb-3 justify-between py-10">
          <h1 className="font-bold text-2xl">Business Details</h1>
          <div>
            <Button className="w-16 h-16">
              <Edit />
            </Button>
          </div>
        </div>
        <div>
          <div>
            <ProfileFieldCart keys={"Business Name"} value={businessDetails.businessName || "-"} />
            <Divider className="my-2" />
            <ProfileFieldCart keys={"GST Number"} value={profile?.GSTIN || "-"} />
            <Divider className="my-2" />
            <ProfileFieldCart keys={"Business Email"} value={businessDetails.businessEmail || "-"} />
            <Divider className="my-2" />
            <ProfileFieldCart keys={"Business Address"} value={businessAddress} />
            <Divider className="my-2" />
            <ProfileFieldCart keys={"Business Category"} value={businessDetails.businessType || "-"} />
            <Divider className="my-2" />
            <ProfileFieldCart keys={"Bank Account"} value={maskedAccount} />
          </div>
        </div>
      </div>
    </div>
  );
};
