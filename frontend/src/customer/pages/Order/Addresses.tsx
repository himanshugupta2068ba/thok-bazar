import { Alert, Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useMemo, useState } from "react";
import { Add } from "@mui/icons-material";
import { useNavigate } from "react-router";
import { deleteUserAddress, saveUserAddress } from "../../../Redux Toolkit/featurs/coustomer/userSlice";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/store";
import { AddressForm } from "../Checkout/AddressForm";

type SavedAddress = { _id: string; name?: string; mobile?: string; locality?: string; address?: string; city?: string; state?: string; pincode?: string };
const errorMessage = (error: unknown, fallback: string) => error instanceof Error ? error.message : fallback;

export const Addresses = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, auth } = useAppSelector((state) => state);
  const [error, setError] = useState("");
  const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

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
    } catch (deleteError: unknown) {
      setError(errorMessage(deleteError, "Failed to delete address"));
    }
  };

  const handleSaveAddress = async (values: Record<string, string>) => {
    const jwt = auth.jwt?.trim() || localStorage.getItem("jwt") || "";
    setSaving(true); setError("");
    try {
      await dispatch(saveUserAddress({ addressId: editingAddress?._id, values, jwt })).unwrap();
      setDialogOpen(false); setEditingAddress(null);
    } catch (saveError: unknown) {
      setError(errorMessage(saveError, "Failed to save address"));
    } finally { setSaving(false); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Saved Addresses</h2>
        <Button variant="contained" startIcon={<Add />} onClick={() => { setEditingAddress(null); setDialogOpen(true); }}>
          Add Address
        </Button>
      </div>

      {error ? <Alert severity="error">{error}</Alert> : null}

      {!addresses.length ? (
        <p className="text-gray-500">No saved addresses found.</p>
      ) : null}

      <div className="space-y-3">
        {(addresses as SavedAddress[]).map((address) => (
          <div key={address?._id} className="p-4 border border-gray-300 rounded-md space-y-2">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="font-semibold">{address?.name || "Address"}</h3>
              <div className="flex gap-2"><Button size="small" onClick={() => { setEditingAddress(address); setDialogOpen(true); }}>Edit</Button>
                <Button color="error" size="small" onClick={() => handleDeleteAddress(String(address?._id))}>Delete</Button></div>
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
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingAddress ? "Edit address" : "Add address"}</DialogTitle>
        <DialogContent>
          <AddressForm initialValues={editingAddress || {}} onSave={handleSaveAddress} submitting={saving} onCancel={() => setDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};
