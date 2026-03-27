import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import {
  deleteAdminHomeCategory,
  fetchHomeCategories,
  createAdminHomeCategory,
  updateHomeCategoryStatus,
} from "../../Redux Toolkit/featurs/admin/adminSlice";
import { uploadToCloudiniary } from "../../util/uploadToCloudNarry";
import { electronicsLevelTwo } from "../../data/category/level2/eletronicslevel2";

const ELECTRONIC_SECTION = "ELECTRIC_CATEGORIES";

export const ElectronicTable = () => {
  const dispatch = useAppDispatch();
  const adminToken = localStorage.getItem("adminToken") || "";
  const { homeCategories, loading, error } = useAppSelector((state) => state.adminSlice);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState("");
  const [formValues, setFormValues] = useState({
    name: "",
    categoryId: "",
    image: "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  useEffect(() => {
    dispatch(fetchHomeCategories(adminToken));
  }, [dispatch, adminToken]);

  const electronicRows = useMemo(
    () =>
      (Array.isArray(homeCategories) ? homeCategories : []).filter(
        (category: any) => category?.section === ELECTRONIC_SECTION,
      ),
    [homeCategories],
  );

  const handleOpenEdit = (row: any) => {
    setIsCreateMode(false);
    setSaveError(null);
    setSelectedImage(null);
    setEditingId(String(row?._id || row?.id || ""));
    setFormValues({
      name: row?.name || "",
      categoryId: row?.categoryId || "",
      image: row?.image || "",
    });
    setIsDialogOpen(true);
  };

  const handleOpenCreate = () => {
    setIsCreateMode(true);
    setSaveError(null);
    setSelectedImage(null);
    setEditingId("");
    setFormValues({
      name: "",
      categoryId: electronicsLevelTwo[0]?.categoryId || "",
      image: "",
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!isCreateMode && !editingId) return;

    try {
      setSaving(true);
      setSaveError(null);

      let imageUrl = formValues.image;
      if (selectedImage) {
        imageUrl = await uploadToCloudiniary(selectedImage);
      }

      const payload = {
        name: formValues.name.trim(),
        categoryId: formValues.categoryId.trim(),
        image: imageUrl,
        section: ELECTRONIC_SECTION,
      };

      const resultAction = isCreateMode
        ? await dispatch(
            createAdminHomeCategory({
              payload,
              jwt: adminToken,
            }),
          )
        : await dispatch(
            updateHomeCategoryStatus({
              categoryId: editingId,
              updates: payload,
              jwt: adminToken,
            }),
          );

      if (
        updateHomeCategoryStatus.rejected.match(resultAction) ||
        createAdminHomeCategory.rejected.match(resultAction)
      ) {
        const errorMessage = String(resultAction.payload || "Failed to update category");
        throw new Error(errorMessage);
      }

      setIsDialogOpen(false);
      setIsCreateMode(false);
      setEditingId("");
      setSelectedImage(null);
      dispatch(fetchHomeCategories(adminToken));
    } catch (err: any) {
      setSaveError(err?.message || "Failed to update category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (row: any) => {
    const categoryId = String(row?._id || row?.id || "");
    if (!categoryId) return;

    const confirmed = window.confirm(`Delete "${row?.name || "this electronics category"}"?`);
    if (!confirmed) return;

    try {
      setDeletingId(categoryId);
      setSaveError(null);

      const resultAction = await dispatch(
        deleteAdminHomeCategory({
          categoryId,
          jwt: adminToken,
        }),
      );

      if (deleteAdminHomeCategory.rejected.match(resultAction)) {
        throw new Error(String(resultAction.payload || "Failed to delete category"));
      }
    } catch (err: any) {
      setSaveError(err?.message || "Failed to delete category");
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Electronics Home Section</h2>
        <p className="text-sm text-gray-600">
          Update categories shown in customer home page electronics strip.
        </p>
        <div className="pt-3">
          <Button variant="contained" onClick={handleOpenCreate}>
            Add Electronics Item
          </Button>
        </div>
      </div>

      {error && <Alert severity="error">{error}</Alert>}
      {saveError && <Alert severity="error">{saveError}</Alert>}

      {loading && !electronicRows.length ? (
        <div className="flex justify-center py-10">
          <CircularProgress />
        </div>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 800 }} aria-label="electronics admin table">
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Category ID</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!electronicRows.length ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No electronics categories found.
                  </TableCell>
                </TableRow>
              ) : (
                electronicRows.map((row: any, index: number) => {
                  const rowId = String(row?._id || row?.id || index);
                  return (
                    <TableRow key={rowId}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <img
                          src={row?.image || "https://via.placeholder.com/80"}
                          alt={row?.name || "Electronic category"}
                          className="w-20 h-20 rounded-md object-cover"
                        />
                      </TableCell>
                      <TableCell>{row?.name || "-"}</TableCell>
                      <TableCell>{row?.categoryId || "-"}</TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenEdit(row)}
                          disabled={deletingId === rowId}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(row)}
                          disabled={deletingId === rowId}
                        >
                          {deletingId === rowId ? <CircularProgress size={18} /> : <Delete />}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{isCreateMode ? "Add Electronics Category" : "Update Electronics Category"}</DialogTitle>
        <DialogContent>
          <div className="grid grid-cols-1 gap-4 mt-2">
            <TextField
              label="Category Name"
              value={formValues.name}
              onChange={(event) =>
                setFormValues((prev) => ({ ...prev, name: event.target.value }))
              }
              fullWidth
            />

            <TextField
              label="Electronic Subcategory"
              value={formValues.categoryId}
              onChange={(event) =>
                setFormValues((prev) => ({ ...prev, categoryId: event.target.value }))
              }
              select
              fullWidth
            >
              {electronicsLevelTwo.map((category) => (
                <MenuItem key={category.categoryId} value={category.categoryId}>
                  {category.name} ({category.categoryId})
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Image URL"
              value={formValues.image}
              onChange={(event) =>
                setFormValues((prev) => ({ ...prev, image: event.target.value }))
              }
              fullWidth
            />

            <div>
              <p className="text-sm text-gray-600 mb-2">Or Upload New Image (Cloudinary)</p>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0] || null;
                  setSelectedImage(file);
                }}
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
