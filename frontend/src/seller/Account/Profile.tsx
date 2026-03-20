import { Edit } from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Button,
  Card,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { ProfileFieldCart } from "../../customer/pages/account/ProfileFieldCart";
import {
  fetchSellerProfile,
  fetchSellerReports,
  updateSellerProfile,
} from "../../Redux Toolkit/featurs/seller/sellerSlice";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import { formatCurrency, formatStatusLabel } from "../shared/sellerViewUtils";

type EditSection = "personal" | "business" | null;

interface SellerEditFormState {
  sellerName: string;
  email: string;
  mobile: string;
  GSTIN: string;
  businessName: string;
  businessEmail: string;
  businessMobile: string;
  businessAddress: string;
  businessType: string;
  accountNumber: string;
  accountHolderName: string;
  bankName: string;
  ifscCode: string;
}

const buildFormState = (profile: any): SellerEditFormState => ({
  sellerName: profile?.sellerName || "",
  email: profile?.email || "",
  mobile: profile?.mobile || "",
  GSTIN: profile?.GSTIN || "",
  businessName: profile?.businessDetails?.businessName || "",
  businessEmail: profile?.businessDetails?.businessEmail || "",
  businessMobile: profile?.businessDetails?.businessMobile || "",
  businessAddress:
    profile?.businessDetails?.businessAddress || profile?.pickupAddress?.address || "",
  businessType: profile?.businessDetails?.businessType || "",
  accountNumber: profile?.bankDetails?.accountNumber || "",
  accountHolderName: profile?.bankDetails?.accountHolderName || "",
  bankName: profile?.bankDetails?.bankName || "",
  ifscCode: profile?.bankDetails?.ifscCode || "",
});

export const Profile = () => {
  const dispatch = useAppDispatch();
  const { profile, reports, loading, error } = useAppSelector((state) => state.sellerData);
  const [editSection, setEditSection] = useState<EditSection>(null);
  const [formValues, setFormValues] = useState<SellerEditFormState>(buildFormState(null));

  useEffect(() => {
    const sellerJwt = localStorage.getItem("sellerJwt");
    if (sellerJwt) {
      dispatch(fetchSellerProfile(sellerJwt));
      dispatch(fetchSellerReports(sellerJwt));
    }
  }, [dispatch]);

  useEffect(() => {
    setFormValues(buildFormState(profile));
  }, [profile]);

  const businessDetails = profile?.businessDetails || {};
  const bankDetails = profile?.bankDetails || {};
  const pickupAddress = profile?.pickupAddress || {};
  const report = reports || {};
  const isProfileLoading = loading && !profile;
  const sellerJwt = localStorage.getItem("sellerJwt");

  const maskedAccount = bankDetails.accountNumber
    ? `XXXX XXXX XXXX ${String(bankDetails.accountNumber).slice(-4)}`
    : "-";

  const businessAddress = businessDetails.businessAddress || pickupAddress.address || "-";

  const handleOpenEditor = (section: EditSection) => {
    setFormValues(buildFormState(profile));
    setEditSection(section);
  };

  const handleCloseEditor = () => {
    setEditSection(null);
  };

  const handleFieldChange = (field: keyof SellerEditFormState, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveProfile = async () => {
    if (!sellerJwt || !editSection) {
      return;
    }

    const updates =
      editSection === "personal"
        ? {
            sellerName: formValues.sellerName,
            email: formValues.email,
            mobile: formValues.mobile,
          }
        : {
            GSTIN: formValues.GSTIN,
            businessDetails: {
              ...(profile?.businessDetails || {}),
              businessName: formValues.businessName,
              businessEmail: formValues.businessEmail,
              businessMobile: formValues.businessMobile,
              businessAddress: formValues.businessAddress,
              businessType: formValues.businessType,
            },
            bankDetails: {
              ...(profile?.bankDetails || {}),
              accountNumber: formValues.accountNumber,
              accountHolderName: formValues.accountHolderName,
              bankName: formValues.bankName,
              ifscCode: formValues.ifscCode,
            },
          };

    const resultAction = await dispatch(updateSellerProfile({ jwt: sellerJwt, updates }));

    if (updateSellerProfile.fulfilled.match(resultAction)) {
      handleCloseEditor();
    }
  };

  return (
    <div className="lg:px-20 flex justify-center space-y-20 pt-5 pb-20">
      <div className="w-full lg:w-[70%]">
        {isProfileLoading && (
          <div className="flex justify-center py-10">
            <CircularProgress />
          </div>
        )}

        {!isProfileLoading && error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <div className="grid gap-4 pb-8 md:grid-cols-2 xl:grid-cols-4">
          <Card className="rounded-md p-5">
            <p className="text-sm text-gray-500">Total Orders</p>
            <h2 className="pt-2 text-2xl font-bold">{report?.totalOrders || 0}</h2>
          </Card>

          <Card className="rounded-md p-5">
            <p className="text-sm text-gray-500">Transactions</p>
            <h2 className="pt-2 text-2xl font-bold">{report?.totalTransactions || 0}</h2>
          </Card>

          <Card className="rounded-md p-5">
            <p className="text-sm text-gray-500">Net Payments</p>
            <h2 className="pt-2 text-2xl font-bold text-teal-700">
              {formatCurrency(report?.netEarnings || 0)}
            </h2>
          </Card>

          <Card className="rounded-md p-5">
            <p className="text-sm text-gray-500">Account Status</p>
            <h2 className="pt-2 text-xl font-bold">
              {formatStatusLabel(profile?.accountStatus || "PENDING_VERIFICATION")}
            </h2>
          </Card>
        </div>

        <div className="flex items-center justify-between pb-3">
          <h1 className="text-2xl font-bold">Personal Details</h1>
          <div>
            <Button className="h-16 w-16" onClick={() => handleOpenEditor("personal")}>
              <Edit />
            </Button>
          </div>
        </div>

        <div>
          <Avatar sx={{ width: "10rem", height: "10rem" }} src={businessDetails.logo || ""} />
          <div>
            <ProfileFieldCart keys={"Seller Name"} value={profile?.sellerName || "-"} />
            <Divider className="my-2" />
            <ProfileFieldCart keys={"Email"} value={profile?.email || "-"} />
            <Divider className="my-2" />
            <ProfileFieldCart keys={"Phone"} value={profile?.mobile || "-"} />
            <Divider className="my-2" />
            <ProfileFieldCart
              keys={"Status"}
              value={formatStatusLabel(profile?.accountStatus || "PENDING_VERIFICATION")}
            />
          </div>
        </div>

        <Divider className="my-10" />

        <div className="flex items-center justify-between py-10 pb-3">
          <h1 className="text-2xl font-bold">Business Details</h1>
          <div>
            <Button className="h-16 w-16" onClick={() => handleOpenEditor("business")}>
              <Edit />
            </Button>
          </div>
        </div>

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

      <Dialog open={Boolean(editSection)} onClose={handleCloseEditor} fullWidth maxWidth="sm">
        <DialogTitle>
          {editSection === "personal" ? "Edit Personal Details" : "Edit Business Details"}
        </DialogTitle>
        <DialogContent className="space-y-4 !pt-4">
          {editSection === "personal" ? (
            <>
              <TextField
                fullWidth
                label="Seller Name"
                value={formValues.sellerName}
                onChange={(event) => handleFieldChange("sellerName", event.target.value)}
              />
              <TextField
                fullWidth
                label="Email"
                value={formValues.email}
                onChange={(event) => handleFieldChange("email", event.target.value)}
              />
              <TextField
                fullWidth
                label="Phone"
                value={formValues.mobile}
                onChange={(event) => handleFieldChange("mobile", event.target.value)}
              />
            </>
          ) : (
            <>
              <TextField
                fullWidth
                label="Business Name"
                value={formValues.businessName}
                onChange={(event) => handleFieldChange("businessName", event.target.value)}
              />
              <TextField
                fullWidth
                label="GST Number"
                value={formValues.GSTIN}
                onChange={(event) => handleFieldChange("GSTIN", event.target.value)}
              />
              <TextField
                fullWidth
                label="Business Email"
                value={formValues.businessEmail}
                onChange={(event) => handleFieldChange("businessEmail", event.target.value)}
              />
              <TextField
                fullWidth
                label="Business Phone"
                value={formValues.businessMobile}
                onChange={(event) => handleFieldChange("businessMobile", event.target.value)}
              />
              <TextField
                fullWidth
                label="Business Address"
                value={formValues.businessAddress}
                onChange={(event) => handleFieldChange("businessAddress", event.target.value)}
              />
              <TextField
                fullWidth
                label="Business Category"
                value={formValues.businessType}
                onChange={(event) => handleFieldChange("businessType", event.target.value)}
              />
              <TextField
                fullWidth
                label="Account Number"
                value={formValues.accountNumber}
                onChange={(event) => handleFieldChange("accountNumber", event.target.value)}
              />
              <TextField
                fullWidth
                label="Account Holder Name"
                value={formValues.accountHolderName}
                onChange={(event) => handleFieldChange("accountHolderName", event.target.value)}
              />
              <TextField
                fullWidth
                label="Bank Name"
                value={formValues.bankName}
                onChange={(event) => handleFieldChange("bankName", event.target.value)}
              />
              <TextField
                fullWidth
                label="IFSC Code"
                value={formValues.ifscCode}
                onChange={(event) => handleFieldChange("ifscCode", event.target.value)}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditor}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveProfile} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
