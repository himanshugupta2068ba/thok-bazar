import { useEffect, useMemo, useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField,
} from "@mui/material";
import { useAppSelector } from "../../../Redux Toolkit/store";
import { ProfileFieldCart } from "./ProfileFieldCart";

const PROFILE_OVERRIDES_KEY = "customer_profile_overrides";

export const UserProfile = () => {
    const { auth } = useAppSelector((state: any) => state);
    const [isEditing, setIsEditing] = useState(false);
    const [formValues, setFormValues] = useState({
        name: "",
        email: "",
        mobile: "",
    });
    const [overrides, setOverrides] = useState<{ name?: string; email?: string; mobile?: string }>({});

    useEffect(() => {
        try {
            const stored = localStorage.getItem(PROFILE_OVERRIDES_KEY);
            if (stored) {
                setOverrides(JSON.parse(stored));
            }
        } catch {
            setOverrides({});
        }
    }, []);

    const profile = useMemo(() => {
        const baseName = auth.user?.fullName || auth.user?.name || "N/A";
        const baseEmail = auth.user?.email || "N/A";
        const baseMobile = auth.user?.mobile || "N/A";

        return {
            name: overrides.name || baseName,
            email: overrides.email || baseEmail,
            mobile: overrides.mobile || baseMobile,
        };
    }, [auth.user, overrides]);

    const handleOpenEdit = () => {
        setFormValues({
            name: profile.name === "N/A" ? "" : profile.name,
            email: profile.email === "N/A" ? "" : profile.email,
            mobile: profile.mobile === "N/A" ? "" : profile.mobile,
        });
        setIsEditing(true);
    };

    const handleSave = () => {
        const nextOverrides = {
            name: formValues.name.trim() || undefined,
            email: formValues.email.trim() || undefined,
            mobile: formValues.mobile.trim() || undefined,
        };

        setOverrides(nextOverrides);
        localStorage.setItem(PROFILE_OVERRIDES_KEY, JSON.stringify(nextOverrides));
        setIsEditing(false);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Personal Information</h2>
                <Button variant="outlined" onClick={handleOpenEdit}>
                    Edit
                </Button>
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
                            onChange={(event) =>
                                setFormValues((prev) => ({ ...prev, email: event.target.value }))
                            }
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
                    <Button onClick={handleSave} variant="contained">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};