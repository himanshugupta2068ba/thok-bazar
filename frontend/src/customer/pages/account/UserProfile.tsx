import { useMemo, useState } from "react";
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/store";
import { ProfileFieldCart } from "./ProfileFieldCart";
import { changeUserPassword, updateUserProfile } from "../../../Redux Toolkit/featurs/coustomer/userSlice";

export const UserProfile = () => {
    const dispatch = useAppDispatch();
    const { auth, user } = useAppSelector((state) => state);
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [saving, setSaving] = useState(false);
    const [formValues, setFormValues] = useState({
        name: "",
        email: "",
        mobile: "",
    });
    const [passwordValues, setPasswordValues] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

    const profile = useMemo(() => {
        const source = user.user || auth.user || {};

        return {
            name: source.fullName || source.name || "N/A",
            email: source.email || "N/A",
            mobile: source.mobile || "N/A",
        };
    }, [auth.user, user.user]);

    const handleOpenEdit = () => {
        setFormValues({
            name: profile.name === "N/A" ? "" : profile.name,
            email: profile.email === "N/A" ? "" : profile.email,
            mobile: profile.mobile === "N/A" ? "" : profile.mobile,
        });
        setIsEditing(true);
    };

    const getJwt = () => auth.jwt?.trim() || localStorage.getItem("jwt") || "";
    const handleSave = async () => {
        setSaving(true); setMessage(null);
        try {
            await dispatch(updateUserProfile({ values: formValues, jwt: getJwt() })).unwrap();
            setMessage({ type: "success", text: "Profile updated successfully." });
            setIsEditing(false);
        } catch (error: unknown) {
            setMessage({ type: "error", text: error instanceof Error ? error.message : "Unable to update profile." });
        } finally { setSaving(false); }
    };

    const handlePasswordSave = async () => {
        if (passwordValues.newPassword !== passwordValues.confirmPassword) {
            setMessage({ type: "error", text: "New passwords do not match." }); return;
        }
        setSaving(true); setMessage(null);
        try {
            await dispatch(changeUserPassword({ values: passwordValues, jwt: getJwt() })).unwrap();
            setPasswordValues({ currentPassword: "", newPassword: "", confirmPassword: "" });
            setIsChangingPassword(false);
            setMessage({ type: "success", text: "Password changed successfully." });
        } catch (error: unknown) {
            setMessage({ type: "error", text: error instanceof Error ? error.message : "Unable to change password." });
        } finally { setSaving(false); }
    };

    return (
        <div>
            {message && <Alert severity={message.type} sx={{ mb: 2 }}>{message.text}</Alert>}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
                <h2 className="text-lg font-semibold">Personal Information</h2>
                <div className="flex flex-wrap gap-2">
                    <Button variant="outlined" onClick={() => setIsChangingPassword(true)}>Change password</Button>
                    <Button variant="contained" onClick={handleOpenEdit}>Edit profile</Button>
                </div>
            </div>

            <Stack spacing={1.5}>
                <ProfileFieldCart keys="Name" value={profile.name} />
                <ProfileFieldCart keys="Email" value={profile.email} />
                <ProfileFieldCart keys="Phone" value={profile.mobile} />
                <ProfileFieldCart keys="Password" value="********" />
            </Stack>

            <Dialog open={isEditing} onClose={() => setIsEditing(false)} fullWidth maxWidth="sm">
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogContent>
                    <div className="grid grid-cols-1 gap-4 pt-2">
                        <TextField
                            label="Name"
                            value={formValues.name}
                            onChange={(event) =>
                                setFormValues((prev) => ({ ...prev, name: event.target.value }))
                            }
                            fullWidth
                        />
                        <TextField
                            label="Email"
                            type="email"
                            value={formValues.email}
                            disabled
                            helperText="Email changes require account verification."
                            fullWidth
                        />
                        <TextField
                            label="Phone"
                            value={formValues.mobile}
                            onChange={(event) =>
                                setFormValues((prev) => ({ ...prev, mobile: event.target.value }))
                            }
                            fullWidth
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained" disabled={saving}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isChangingPassword} onClose={() => setIsChangingPassword(false)} fullWidth maxWidth="sm">
                <DialogTitle>Change password</DialogTitle>
                <DialogContent><Stack spacing={2} sx={{ pt: 1 }}>
                    {([['currentPassword', 'Current password'], ['newPassword', 'New password'], ['confirmPassword', 'Confirm new password']] as const).map(([name, label]) => (
                        <TextField key={name} label={label} type="password" value={passwordValues[name]}
                            onChange={(event) => setPasswordValues((prev) => ({ ...prev, [name]: event.target.value }))} fullWidth />
                    ))}
                </Stack></DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsChangingPassword(false)}>Cancel</Button>
                    <Button onClick={handlePasswordSave} variant="contained" disabled={saving}>Update password</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};
