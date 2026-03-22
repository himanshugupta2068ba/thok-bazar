import { Edit } from "@mui/icons-material";
import {
  Alert,
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
import { api } from "../../config/api";
import { getValidAdminJwt } from "../../util/adminSession";

interface AdminFormState {
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const buildFormState = (admin: any): AdminFormState => ({
  email: admin?.email || "",
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const formatDate = (value?: string | null) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString();
};

export const AdminAccount = () => {
  const [admin, setAdmin] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [formValues, setFormValues] = useState<AdminFormState>(buildFormState(null));

  useEffect(() => {
    const adminJwt = getValidAdminJwt();

    if (!adminJwt) {
      setLoading(false);
      return;
    }

    api
      .get("/admin/account", {
        headers: {
          Authorization: `Bearer ${adminJwt}`,
        },
      })
      .then((response) => {
        const nextAdmin = response.data?.admin || response.data;
        setAdmin(nextAdmin);
        setFormValues(buildFormState(nextAdmin));
      })
      .catch((requestError: any) => {
        setError(
          requestError?.response?.data?.message ||
            requestError?.response?.data?.error ||
            requestError?.message ||
            "Unable to load admin account",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleOpenEdit = () => {
    setSuccessMessage("");
    setError("");
    setFormValues(buildFormState(admin));
    setEditOpen(true);
  };

  const handleCloseEdit = () => {
    setEditOpen(false);
    setFormValues(buildFormState(admin));
  };

  const handleFieldChange = (field: keyof AdminFormState, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    const adminJwt = getValidAdminJwt();

    if (!adminJwt) {
      setError("Admin session expired. Please log in again.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await api.put(
        "/admin/account",
        {
          email: formValues.email,
          currentPassword: formValues.currentPassword,
          newPassword: formValues.newPassword,
          confirmPassword: formValues.confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${adminJwt}`,
          },
        },
      );

      const nextAdmin = response.data?.admin || response.data;
      const nextJwt = response.data?.jwt;

      if (nextJwt) {
        localStorage.setItem("adminToken", nextJwt);
      }

      setAdmin(nextAdmin);
      setFormValues(buildFormState(nextAdmin));
      setSuccessMessage("Admin account updated successfully");
      setEditOpen(false);
    } catch (requestError: any) {
      setError(
        requestError?.response?.data?.message ||
          requestError?.response?.data?.error ||
          requestError?.message ||
          "Unable to update admin account",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Account</h1>
          <p className="text-sm text-slate-600">
            Review and update the authenticated admin login details.
          </p>
        </div>
        <Button startIcon={<Edit />} variant="contained" onClick={handleOpenEdit}>
          Edit Account
        </Button>
      </div>

      {error ? <Alert severity="error">{error}</Alert> : null}
      {successMessage ? <Alert severity="success">{successMessage}</Alert> : null}

      <Card className="rounded-xl border border-slate-200 p-6 shadow-none">
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
              Admin Email
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{admin?.email || "-"}</p>
          </div>

          <Divider />

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
              Role
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{admin?.role || "-"}</p>
          </div>

          <Divider />

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                Created
              </p>
              <p className="mt-2 text-sm text-slate-700">{formatDate(admin?.createdAt)}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                Last Updated
              </p>
              <p className="mt-2 text-sm text-slate-700">{formatDate(admin?.updatedAt)}</p>
            </div>
          </div>
        </div>
      </Card>

      <Dialog open={editOpen} onClose={handleCloseEdit} fullWidth maxWidth="sm">
        <DialogTitle>Edit Admin Account</DialogTitle>
        <DialogContent className="space-y-4 !pt-4">
          <TextField
            fullWidth
            label="Admin Email"
            value={formValues.email}
            onChange={(event) => handleFieldChange("email", event.target.value)}
          />
          <TextField
            fullWidth
            label="Current Password"
            type="password"
            value={formValues.currentPassword}
            onChange={(event) => handleFieldChange("currentPassword", event.target.value)}
            helperText="Current password is required to confirm any admin account update."
          />
          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={formValues.newPassword}
            onChange={(event) => handleFieldChange("newPassword", event.target.value)}
            helperText="Leave blank if you only want to change the admin email."
          />
          <TextField
            fullWidth
            label="Confirm New Password"
            type="password"
            value={formValues.confirmPassword}
            onChange={(event) => handleFieldChange("confirmPassword", event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
