import { Edit } from "@mui/icons-material";
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
  IconButton,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import {
  createAdminHomeCategory,
  fetchHomeCategories,
  updateHomeCategoryStatus,
} from "../../Redux Toolkit/featurs/admin/adminSlice";
import mainCategory from "../../data/category/mainCategory";
import { electronicsLevelTwo } from "../../data/category/level2/eletronicslevel2";
import { homelivingLevelTwo } from "../../data/category/level2/homelivinglevel2";
import { menLevelTwo } from "../../data/category/level2/menlevelTwo";
import { womenLevelTwo } from "../../data/category/level2/womenlevel2";
import { uploadToCloudiniary } from "../../util/uploadToCloudNarry";

const SECTION_OPTIONS = [
  "ELECTRIC_CATEGORIES",
  "GRID",
  "SHOP_BY_CATEGORY",
  "SHOP_BY_BRAND",
  "TOP_DEALS",
] as const;

type HomeCategoryTableProps = {
  section?: string;
  title?: string;
  description?: string;
  addButtonLabel?: string;
  allowCreate?: boolean;
  maxItems?: number;
  rowLabel?: string;
};

type CategoryOption = {
  id: string;
  name: string;
};

const levelTwoOptions = [...menLevelTwo, ...womenLevelTwo, ...homelivingLevelTwo, ...electronicsLevelTwo];

const getCategoryOptionsBySection = (section?: string): CategoryOption[] => {
  if (section === "GRID") {
    const seen = new Set<string>();
    return levelTwoOptions
      .filter((item) => {
        if (!item?.categoryId || seen.has(item.categoryId)) {
          return false;
        }
        seen.add(item.categoryId);
        return true;
      })
      .map((item) => ({ id: item.categoryId, name: item.name }));
  }

  if (section === "SHOP_BY_CATEGORY") {
    return mainCategory
      .filter((item: any) => item?.categoryid)
      .map((item: any) => ({ id: item.categoryid, name: item.name }));
  }

  return [];
};

export const HomeCategoryTable = ({
  section,
  title,
  description,
  addButtonLabel,
  allowCreate = true,
  maxItems,
  rowLabel = "No",
}: HomeCategoryTableProps) => {
  const dispatch = useAppDispatch();
  const adminToken = localStorage.getItem("adminToken") || "";
  const { homeCategories, loading, error } = useAppSelector((state) => state.adminSlice);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [formValues, setFormValues] = useState({
    name: "",
    categoryId: "",
    image: "",
  });

  useEffect(() => {
    dispatch(fetchHomeCategories(adminToken));
  }, [dispatch, adminToken]);

  const categoryOptions = useMemo(() => getCategoryOptionsBySection(section), [section]);

  const defaultCategoryId = categoryOptions[0]?.id || "";

  const filteredRows = useMemo(() => {
    const rows = (Array.isArray(homeCategories) ? homeCategories : []).filter((category: any) =>
      section ? category?.section === section : true,
    );

    if (typeof maxItems === "number" && maxItems > 0) {
      return rows.slice(0, maxItems);
    }

    return rows;
  }, [homeCategories, section, maxItems]);

  const handleSectionChange = async (categoryId: string, nextSection: string) => {
    await dispatch(
      updateHomeCategoryStatus({
        categoryId,
        updates: { section: nextSection },
        jwt: adminToken,
      }),
    );
  };

  const handleOpenCreate = () => {
    setIsCreateMode(true);
    setSaveError(null);
    setEditingId("");
    setSelectedImage(null);
    setFormValues({
      name: "",
      categoryId: defaultCategoryId,
      image: "",
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (row: any) => {
    setIsCreateMode(false);
    setSaveError(null);
    setSelectedImage(null);
    setEditingId(String(row?._id || row?.id || ""));
    setFormValues({
      name: row?.name || "",
      categoryId: row?.categoryId || defaultCategoryId,
      image: row?.image || "",
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!section) return;
    if (!isCreateMode && !editingId) return;

    const trimmedName = formValues.name.trim();
    const trimmedCategoryId = formValues.categoryId.trim();
    if (!trimmedName || !trimmedCategoryId) {
      setSaveError("Name and category are required.");
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
        name: trimmedName,
        categoryId: trimmedCategoryId,
        image: imageUrl,
        section,
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
        createAdminHomeCategory.rejected.match(resultAction) ||
        updateHomeCategoryStatus.rejected.match(resultAction)
      ) {
        throw new Error(String(resultAction.payload || "Failed to save category"));
      }

      setIsDialogOpen(false);
      setIsCreateMode(false);
      setEditingId("");
      setSelectedImage(null);
      dispatch(fetchHomeCategories(adminToken));
    } catch (err: any) {
      setSaveError(err?.message || "Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3">
      {(title || description || section) && (
        <div>
          {title && <h2 className="text-xl font-semibold">{title}</h2>}
          {description && <p className="text-sm text-gray-600">{description}</p>}
          {section && allowCreate && (
            <div className="pt-3">
              <Button variant="contained" onClick={handleOpenCreate}>
                {addButtonLabel || "Add Item"}
              </Button>
            </div>
          )}
        </div>
      )}

      {error && <Alert severity="error">{error}</Alert>}
      {saveError && <Alert severity="error">{saveError}</Alert>}

      {loading && !filteredRows.length ? (
        <div className="flex justify-center py-8">
          <CircularProgress />
        </div>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 800 }} aria-label="home category table">
            <TableHead>
              <TableRow>
                <TableCell>{rowLabel}</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Category ID</TableCell>
                <TableCell>{section ? "Update" : "Section"}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!filteredRows.length ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No categories found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRows.map((row: any, index: number) => {
                  const categoryId = String(row?._id || row?.id || "");
                  return (
                    <TableRow key={categoryId || index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <img
                          className="w-20 h-20 rounded-md object-cover"
                          src={row?.image || "https://via.placeholder.com/80"}
                          alt={row?.name || "Category"}
                        />
                      </TableCell>
                      <TableCell>{row?.name || "-"}</TableCell>
                      <TableCell>{row?.categoryId || "-"}</TableCell>
                      <TableCell>
                        {section ? (
                          <IconButton color="primary" onClick={() => handleOpenEdit(row)}>
                            <Edit />
                          </IconButton>
                        ) : (
                          <FormControl size="small" sx={{ minWidth: 220 }}>
                            <Select
                              value={row?.section || "GRID"}
                              onChange={(event) => handleSectionChange(categoryId, event.target.value)}
                            >
                              {SECTION_OPTIONS.map((option) => (
                                <MenuItem key={option} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        )}
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
        <DialogTitle>{isCreateMode ? "Add Home Category Item" : "Update Home Category Item"}</DialogTitle>
        <DialogContent>
          <div className="grid grid-cols-1 gap-4 mt-2">
            <TextField
              label="Name"
              value={formValues.name}
              onChange={(event) =>
                setFormValues((prev) => ({ ...prev, name: event.target.value }))
              }
              fullWidth
            />

            {categoryOptions.length ? (
              <TextField
                label="Category"
                value={formValues.categoryId}
                onChange={(event) =>
                  setFormValues((prev) => ({ ...prev, categoryId: event.target.value }))
                }
                select
                fullWidth
              >
                {categoryOptions.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name} ({category.id})
                  </MenuItem>
                ))}
              </TextField>
            ) : (
              <TextField
                label="Category ID"
                value={formValues.categoryId}
                onChange={(event) =>
                  setFormValues((prev) => ({ ...prev, categoryId: event.target.value }))
                }
                fullWidth
              />
            )}

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
