import { useEffect, useState } from "react";
import {
  Alert,
  FormControl,
  IconButton,
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
  CircularProgress,
} from "@mui/material";
import { Delete, Edit, Save } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import { deleteDeal, fetchDeals, updateDeal } from "../../Redux Toolkit/featurs/admin/DealSlice";

export const DealTable = () => {
  const dispatch = useAppDispatch();
  const adminToken = localStorage.getItem("adminToken") || "";
  const { deals, loading, error, successMessage } = useAppSelector((state) => state.deals);

  const [editDealId, setEditDealId] = useState<string | null>(null);
  const [discountInput, setDiscountInput] = useState("");

  useEffect(() => {
    dispatch(fetchDeals(adminToken));
  }, [dispatch, adminToken]);

  const handleEdit = (deal: any) => {
    const dealId = String(deal?._id || deal?.id || "");
    setEditDealId(dealId);
    setDiscountInput(String(deal?.discount || ""));
  };

  const handleSave = async (dealId: string) => {
    await dispatch(updateDeal({ dealId, discount: Number(discountInput), jwt: adminToken }));
    setEditDealId(null);
    setDiscountInput("");
  };

  const handleDelete = async (dealId: string) => {
    const shouldDelete = window.confirm("Delete this deal?");
    if (!shouldDelete) return;
    await dispatch(deleteDeal({ dealId, jwt: adminToken }));
  };

  return (
    <div className="space-y-3">
      {error && <Alert severity="error">{error}</Alert>}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}

      {loading && !deals.length ? (
        <div className="flex justify-center py-8">
          <CircularProgress />
        </div>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="deal table">
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Discount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Edit</TableCell>
                <TableCell>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!deals.length ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No deals found.
                  </TableCell>
                </TableRow>
              ) : (
                deals.map((deal: any, index: number) => {
                  const dealId = String(deal?._id || deal?.id || "");
                  const isEditing = editDealId === dealId;

                  return (
                    <TableRow key={dealId}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <p className="font-medium">{deal?.category?.name || "-"}</p>
                        <p className="text-xs text-gray-500">{dealId}</p>
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <TextField
                            size="small"
                            type="number"
                            value={discountInput}
                            onChange={(event) => setDiscountInput(event.target.value)}
                          />
                        ) : (
                          `${deal?.discount || 0}%`
                        )}
                      </TableCell>
                      <TableCell>
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                          <Select
                            value={deal?.isActive === false ? "false" : "true"}
                            onChange={(event) =>
                              dispatch(
                                updateDeal({
                                  dealId,
                                  isActive: event.target.value === "true",
                                  jwt: adminToken,
                                }),
                              )
                            }
                          >
                            <MenuItem value="true">Active</MenuItem>
                            <MenuItem value="false">Inactive</MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell>
                        <IconButton color="primary" onClick={() => (isEditing ? handleSave(dealId) : handleEdit(deal))}>
                          {isEditing ? <Save /> : <Edit />}
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <IconButton color="error" onClick={() => handleDelete(dealId)}>
                          <Delete />
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
    </div>
  );
};
