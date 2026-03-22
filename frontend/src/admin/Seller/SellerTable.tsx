import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import {
  Alert,
  CircularProgress,
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
  Chip,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import { fetchSeller, updateSellerStatus } from "../../Redux Toolkit/featurs/seller/sellerSlice";

const STATUS_OPTIONS = [
  "PENDING_VERIFICATION",
  "ACTIVE",
  "INACTIVE",
  "SUSPENDED",
  "BLOCKED",
  "CLOSED",
] as const;

const statusLabel = (value?: string) =>
  String(value || "")
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const statusColor = (status?: string) => {
  switch (status) {
    case "ACTIVE":
      return "success";
    case "PENDING_VERIFICATION":
      return "warning";
    case "INACTIVE":
      return "default";
    case "SUSPENDED":
    case "BLOCKED":
    case "CLOSED":
      return "error";
    default:
      return "default";
  }
};

export const SellerTables = () => {
  const dispatch = useAppDispatch();
  const { sellers, loading, error } = useAppSelector((state) => state.sellerData);
  const adminToken = localStorage.getItem("adminToken") || "";
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    const filter = statusFilter === "ALL" ? null : statusFilter;
    dispatch(fetchSeller({ status: filter, jwt: adminToken }));
  }, [adminToken, dispatch, statusFilter]);

  const sellerRows = useMemo(() => (Array.isArray(sellers) ? sellers : []), [sellers]);

  const handleStatusChange = async (sellerId: string, nextStatus: string) => {
    if (!sellerId || !nextStatus) return;
    await dispatch(updateSellerStatus({ sellerId, status: nextStatus, jwt: adminToken }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <FormControl size="small" sx={{ minWidth: 220 }}>
          <InputLabel id="seller-status-filter-label">Account Status</InputLabel>
          <Select
            labelId="seller-status-filter-label"
            label="Account Status"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <MenuItem value="ALL">All Sellers</MenuItem>
            {STATUS_OPTIONS.map((status) => (
              <MenuItem key={status} value={status}>
                {statusLabel(status)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {error && <Alert severity="error">{error}</Alert>}

      {loading && !sellerRows.length ? (
        <div className="flex justify-center py-10">
          <CircularProgress />
        </div>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 900 }} aria-label="seller admin table">
            <TableHead>
              <TableRow>
                <TableCell>Seller</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Business</TableCell>
                <TableCell>Current Status</TableCell>
                <TableCell>Update Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!sellerRows.length ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No sellers found.
                  </TableCell>
                </TableRow>
              ) : (
                sellerRows.map((seller: any) => {
                  const sellerId = String(seller?._id || seller?.id || "");
                  const currentStatus = String(seller?.accountStatus || "PENDING_VERIFICATION");

                  return (
                    <TableRow key={sellerId}>
                      <TableCell>
                        <p className="font-semibold">{seller?.sellerName || "-"}</p>
                        <p className="text-xs text-gray-500">{sellerId}</p>
                      </TableCell>
                      <TableCell>
                        <p>{seller?.email || "-"}</p>
                        <p className="text-sm text-gray-600">{seller?.mobile || "-"}</p>
                      </TableCell>
                      <TableCell>
                        <p>{seller?.businessDetails?.businessName || "-"}</p>
                        <p className="text-sm text-gray-600">{seller?.businessDetails?.businessAddress || "-"}</p>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={statusLabel(currentStatus)}
                          color={statusColor(currentStatus) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <FormControl size="small" sx={{ minWidth: 190 }}>
                          <Select
                            value={currentStatus}
                            onChange={(event: ChangeEvent<HTMLInputElement> | any) =>
                              handleStatusChange(sellerId, event.target.value)
                            }
                          >
                            {STATUS_OPTIONS.map((status) => (
                              <MenuItem key={status} value={status}>
                                {statusLabel(status)}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
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
