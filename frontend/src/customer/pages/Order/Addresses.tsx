import { Alert, Button } from "@mui/material";
import { useMemo, useState } from "react";
import { Add } from "@mui/icons-material";
import { useNavigate } from "react-router";
import { deleteUserAddress } from "../../../Redux Toolkit/featurs/coustomer/userSlice";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/store";

export const Addresses = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, auth } = useAppSelector((state) => state);
  const [error, setError] = useState("");

  const addresses = useMemo(
    () => (Array.isArray(user.user?.address) ? user.user.address : []),
    [user.user?.address],
  );

  const handleDeleteAddress = async (addressId: string) => {
    const jwt = auth.jwt?.trim() || localStorage.getItem("jwt");

    if (!jwt) {
      navigate("/login");
      return;
    }

    try {
      setError("");
      await dispatch(deleteUserAddress({ addressId, jwt })).unwrap();
    } catch (deleteError: any) {
      setError(deleteError?.message || "Failed to delete address");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Saved Addresses</h2>
        <Button variant="outlined" startIcon={<Add />} onClick={() => navigate("/checkout/address")}>
          Add Address
        </Button>
      </div>

      {error ? <Alert severity="error">{error}</Alert> : null}

      {!addresses.length ? (
        <p className="text-gray-500">No saved addresses found.</p>
      ) : null}

      <div className="space-y-3">
        {addresses.map((address: any) => (
          <div key={address?._id} className="p-4 border border-gray-300 rounded-md space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{address?.name || "Address"}</h3>
              <Button color="error" size="small" onClick={() => handleDeleteAddress(String(address?._id))}>
                Delete
              </Button>
            </div>
            <p className="text-sm text-gray-700">
              {[address?.address, address?.locality, address?.city, address?.state, address?.pincode]
                .filter(Boolean)
                .join(", ") || "Address details not available"}
            </p>
            <p className="text-sm">
              <strong>Mobile:</strong> {address?.mobile || "-"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
