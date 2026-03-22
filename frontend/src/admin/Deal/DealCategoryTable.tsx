import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import {
  createAdminHomeCategory,
  fetchHomeCategories,
} from "../../Redux Toolkit/featurs/admin/adminSlice";
import mainCategory from "../../data/category/mainCategory";
import { electronicsLevelTwo } from "../../data/category/level2/eletronicslevel2";
import { homelivingLevelTwo } from "../../data/category/level2/homelivinglevel2";
import { menLevelTwo } from "../../data/category/level2/menlevelTwo";
import { womenLevelTwo } from "../../data/category/level2/womenlevel2";
import { electronicthirdlevel } from "../../data/category/level3/electronicslevel3";
import { homethirdlevel } from "../../data/category/level3/homelivinglevel3";
import { menthirdlevel } from "../../data/category/level3/menthirdlevel";
import { womenthirdlevel } from "../../data/category/level3/womenthirdlevel";
import { uploadToCloudiniary } from "../../util/uploadToCloudNarry";

export const DealCategoryTable = ({ onCreateDeal }: { onCreateDeal?: (category: any) => void }) => {
  const dispatch = useAppDispatch();
  const adminToken = localStorage.getItem("adminToken") || "";
  const { homeCategories, loading, error } = useAppSelector((state) => state.adminSlice);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [formValues, setFormValues] = useState({
    name: "",
    mainCategoryId: "",
    subCategoryId: "",
    category3Id: "",
    image: "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const levelTwoOptions = useMemo(
    () => [...menLevelTwo, ...womenLevelTwo, ...homelivingLevelTwo, ...electronicsLevelTwo],
    [],
  );

  const levelThreeOptions = useMemo(
    () => [...menthirdlevel, ...womenthirdlevel, ...homethirdlevel, ...electronicthirdlevel],
    [],
  );

  const topDealCategories = useMemo(
    () => (homeCategories || []).filter((category: any) => category?.section === "TOP_DEALS"),
    [homeCategories],
  );

  const subCategoryOptions = useMemo(
    () =>
      levelTwoOptions.filter(
        (item: any) => item.parentCategoryId === formValues.mainCategoryId,
      ),
    [levelTwoOptions, formValues.mainCategoryId],
  );

  const category3Options = useMemo(
    () =>
      levelThreeOptions.filter(
        (item: any) => item.parentCategoryId === formValues.subCategoryId,
      ),
    [levelThreeOptions, formValues.subCategoryId],
  );

  useEffect(() => {
    dispatch(fetchHomeCategories(adminToken));
  }, [dispatch, adminToken]);

  const handleOpenCreate = () => {
    setSaveError(null);
    setSelectedImage(null);
    setFormValues({
      name: "",
      mainCategoryId: "",
      subCategoryId: "",
      category3Id: "",
      image: "",
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    const resolvedCategoryId =
      formValues.category3Id || formValues.subCategoryId || formValues.mainCategoryId;

    if (!resolvedCategoryId || !formValues.name.trim()) {
      setSaveError("Name and category are required.");
      return;
    }

    const alreadyExists = topDealCategories.some(
      (category: any) => category?.categoryId === resolvedCategoryId,
    );

    if (alreadyExists) {
      setSaveError("This category already exists in TOP_DEALS.");
      return;
    }

    try {
      setSaving(true);
      setSaveError(null);

      let imageUrl = formValues.image;
      if (selectedImage) {
        imageUrl = await uploadToCloudiniary(selectedImage);
      }

      const payload = {
        name: formValues.name.trim(),
        categoryId: resolvedCategoryId,
        image: imageUrl,
        section: "TOP_DEALS",
      };

      const resultAction = await dispatch(
        createAdminHomeCategory({
          payload,
          jwt: adminToken,
        }),
      );

      if (createAdminHomeCategory.rejected.match(resultAction)) {
        throw new Error(String(resultAction.payload || "Failed to create deal category"));
      }

      setIsDialogOpen(false);
      setSelectedImage(null);
      dispatch(fetchHomeCategories(adminToken));
    } catch (err: any) {
      setSaveError(err?.message || "Failed to create deal category");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3">
      {error && <Alert severity="error">{error}</Alert>}
      {saveError && <Alert severity="error">{saveError}</Alert>}

      <div>
        <Button variant="contained" onClick={handleOpenCreate}>Add Deal Category</Button>
      </div>

      {loading && !topDealCategories.length ? (
        <div className="flex justify-center py-8">
          <CircularProgress />
        </div>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="deal category table">
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Category ID</TableCell>
                <TableCell>Section</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!topDealCategories.length ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No TOP_DEALS categories found.
                  </TableCell>
                </TableRow>
              ) : (
                topDealCategories.map((category: any, index: number) => (
                  <TableRow key={category?._id || category?.id || index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <img
                        className="w-20 rounded-md object-cover"
                        src={category?.image || "https://via.placeholder.com/80"}
                        alt={category?.name || "Category"}
                      />
                    </TableCell>
                    <TableCell>{category?.name || "-"}</TableCell>
                    <TableCell>{category?.categoryId || "-"}</TableCell>
                    <TableCell>{category?.section || "TOP_DEALS"}</TableCell>
                    <TableCell align="right">
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => onCreateDeal?.(category)}
                      >
                        Create Deal
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add TOP_DEALS Category</DialogTitle>
        <DialogContent>
          <div className="grid grid-cols-1 gap-4 mt-2">
            <TextField
              label="Display Name"
              value={formValues.name}
              onChange={(event) => setFormValues((prev) => ({ ...prev, name: event.target.value }))}
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel id="deal-cat-main-label">Category</InputLabel>
              <Select
                labelId="deal-cat-main-label"
                value={formValues.mainCategoryId}
                label="Category"
                onChange={(event) =>
                  setFormValues((prev) => ({
                    ...prev,
                    mainCategoryId: event.target.value,
                    subCategoryId: "",
                    category3Id: "",
                  }))
                }
              >
                {mainCategory.map((cat: any) => (
                  <MenuItem key={cat?.categoryid} value={cat?.categoryid}>
                    {cat?.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="deal-cat-sub-label">Sub Category (Optional)</InputLabel>
              <Select
                labelId="deal-cat-sub-label"
                value={formValues.subCategoryId}
                label="Sub Category (Optional)"
                onChange={(event) =>
                  setFormValues((prev) => ({
                    ...prev,
                    subCategoryId: event.target.value,
                    category3Id: "",
                  }))
                }
                disabled={!formValues.mainCategoryId}
              >
                <MenuItem value="">No sub category</MenuItem>
                {subCategoryOptions.map((cat: any) => (
                  <MenuItem key={cat?.categoryId} value={cat?.categoryId}>
                    {cat?.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="deal-cat-l3-label">Category 3 (Optional)</InputLabel>
              <Select
                labelId="deal-cat-l3-label"
                value={formValues.category3Id}
                label="Category 3 (Optional)"
                onChange={(event) =>
                  setFormValues((prev) => ({ ...prev, category3Id: event.target.value }))
                }
                disabled={!formValues.subCategoryId}
              >
                <MenuItem value="">No category 3</MenuItem>
                {category3Options.map((cat: any) => (
                  <MenuItem key={cat?.categoryId} value={cat?.categoryId}>
                    {cat?.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Image URL"
              value={formValues.image}
              onChange={(event) => setFormValues((prev) => ({ ...prev, image: event.target.value }))}
              fullWidth
            />

            <div>
              <p className="text-sm text-gray-600 mb-2">Or Upload Image (Cloudinary)</p>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setSelectedImage(event.target.files?.[0] || null)}
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
