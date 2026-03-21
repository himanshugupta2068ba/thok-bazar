import { useEffect } from "react";
import {
  Alert,
  Chip,
  CircularProgress,
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
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import {
  deleteCoupon,
  fetchCoupons,
  updateCouponStatus,
} from "../../Redux Toolkit/featurs/admin/couponSlice";

const formatDate = (value?: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-IN");
};

export const Coupon = () => {
  const dispatch = useAppDispatch();
  const { coupons, loading, error, successMessage } = useAppSelector((state) => state.adminCoupons);
  const adminToken = localStorage.getItem("adminToken") || "";

  useEffect(() => {
    dispatch(fetchCoupons(adminToken));
  }, [dispatch, adminToken]);

  const handleDeleteCoupon = async (couponId: string) => {
    if (!couponId) return;
    const shouldDelete = window.confirm("Delete this coupon?");
    if (!shouldDelete) return;
    await dispatch(deleteCoupon({ couponId, jwt: adminToken }));
  };

  const handleChangeStatus = async (couponId: string, status: string) => {
    await dispatch(updateCouponStatus({ couponId, status, jwt: adminToken }));
  };

  return (
    <div className="space-y-4">
      {error && <Alert severity="error">{error}</Alert>}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}

      {loading && !coupons.length ? (
        <div className="flex justify-center py-10">
          <CircularProgress />
        </div>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 900 }} aria-label="coupon table">
            <TableHead>
              <TableRow>
                <TableCell>Coupon Code</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Min Order Amount</TableCell>
                <TableCell>Discount %</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!coupons.length ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No coupons available.
                  </TableCell>
                </TableRow>
              ) : (
                coupons.map((coupon: any) => {
                  const couponId = String(coupon?._id || coupon?.id || "");
                  return (
                    <TableRow key={couponId}>
                      <TableCell>
                        <p className="font-semibold">{coupon?.code || "-"}</p>
                        <p className="text-xs text-gray-500">{couponId}</p>
                      </TableCell>
                      <TableCell>{formatDate(coupon?.startDate)}</TableCell>
                      <TableCell>{formatDate(coupon?.endDate)}</TableCell>
                      <TableCell>{Number(coupon?.minOrderAmount || 0).toLocaleString("en-IN")}</TableCell>
                      <TableCell>{coupon?.discount || 0}%</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Chip
                            size="small"
                            color={coupon?.status === "ACTIVE" ? "success" : "default"}
                            label={coupon?.status || "INACTIVE"}
                          />
                          <Select
                            size="small"
                            value={coupon?.status || "INACTIVE"}
                            onChange={(event) => handleChangeStatus(couponId, event.target.value)}
                          >
                            <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                            <MenuItem value="INACTIVE">INACTIVE</MenuItem>
                          </Select>
                        </div>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton color="error" onClick={() => handleDeleteCoupon(couponId)}>
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
