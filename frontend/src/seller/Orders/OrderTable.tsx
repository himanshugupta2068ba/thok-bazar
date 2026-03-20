import { useEffect, useState, type MouseEvent } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Alert, Button, Chip, CircularProgress, Menu, MenuItem } from "@mui/material";
import { fetchSellerOrders, updateOrderStatus } from "../../Redux Toolkit/featurs/seller/sellerOrderSlice";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import {
  ORDER_STATUS_OPTIONS,
  type SellerOrderStatus,
  formatCurrency,
  formatDateTime,
  formatPaymentMethodLabel,
  formatStatusLabel,
  getAddressText,
  getCustomerContact,
  getCustomerName,
  getOrderStatusColor,
  getOrderTotal,
  getPaymentStatusColor,
  isVisibleSellerOrder,
} from "../shared/sellerViewUtils";
import { fetchSellerTransactions } from "../../Redux Toolkit/featurs/seller/transactionSlice";
import { fetchSellerReports } from "../../Redux Toolkit/featurs/seller/sellerSlice";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    verticalAlign: "top",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function OrderTables() {
  const dispatch = useAppDispatch();
  const { orders, loading, error } = useAppSelector((state) => state.sellerOrders);
  const sellerJwt = localStorage.getItem("sellerJwt");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (sellerJwt) {
      dispatch(fetchSellerOrders(sellerJwt));
    }
  }, [dispatch, sellerJwt]);

  const handleClick = (event: MouseEvent<HTMLButtonElement>, orderId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrderId(orderId);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedOrderId(null);
  };

  const handleUpdateStatus = async (status: SellerOrderStatus) => {
    if (!selectedOrderId || !sellerJwt) {
      handleClose();
      return;
    }

    handleClose();
    const resultAction = await dispatch(updateOrderStatus({ orderId: selectedOrderId, status, jwt: sellerJwt }));

    if (updateOrderStatus.fulfilled.match(resultAction)) {
      await dispatch(fetchSellerOrders(sellerJwt));

      if (status === "CANCELLED") {
        await Promise.all([
          dispatch(fetchSellerTransactions(sellerJwt)),
          dispatch(fetchSellerReports(sellerJwt)),
        ]);
      }
    }
  };

  const open = Boolean(anchorEl);
  const safeOrders = (Array.isArray(orders) ? orders : []).filter(isVisibleSellerOrder);

  if (loading && !safeOrders.length) {
    return (
      <div className="flex justify-center py-10">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && <Alert severity="error">{error}</Alert>}

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 1100 }} aria-label="seller orders table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Order</StyledTableCell>
              <StyledTableCell>Customer</StyledTableCell>
              <StyledTableCell>Products</StyledTableCell>
              <StyledTableCell>Shipping Address</StyledTableCell>
              <StyledTableCell>Payment</StyledTableCell>
              <StyledTableCell>Order Status</StyledTableCell>
              <StyledTableCell>Update</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {!safeOrders.length ? (
              <StyledTableRow>
                <StyledTableCell align="center" colSpan={7}>
                  No valid customer orders found yet.
                </StyledTableCell>
              </StyledTableRow>
            ) : (
              safeOrders.map((order: any) => {
                const orderId = String(order?._id || order?.id || "");
                const orderItems = Array.isArray(order?.orderItems) ? order.orderItems : [];
                const isCancelled = order?.orderStatus === "CANCELLED";
                const isDelivered = order?.orderStatus === "DELIVERED";

                return (
                  <StyledTableRow key={orderId}>
                    <StyledTableCell component="th" scope="row">
                      <div className="space-y-1 min-w-44">
                        <p className="font-semibold text-gray-900 break-all">{orderId || "-"}</p>
                        <p className="text-xs text-gray-500">
                          Ordered {formatDateTime(order?.createdAt || order?.orderDate)}
                        </p>
                        <p className="text-sm font-medium text-teal-700">
                          {formatCurrency(order?.totalSellingPrice)}
                        </p>
                      </div>
                    </StyledTableCell>

                    <StyledTableCell>
                      <div className="space-y-1 min-w-36">
                        <p className="font-semibold">{getCustomerName(order?.user)}</p>
                        <p className="text-sm text-gray-600">{order?.user?.email || "-"}</p>
                        <p className="text-sm text-gray-600">{getCustomerContact(order?.user)}</p>
                      </div>
                    </StyledTableCell>

                    <StyledTableCell>
                      <div className="space-y-3 min-w-72">
                        {orderItems.map((item: any, index: number) => {
                          const itemKey = String(item?._id || `${orderId}-${index}`);
                          const product = item?.product;
                          const image =
                            product?.images?.[0] ||
                            "https://m.media-amazon.com/images/I/61jLi2nQJDL._SX679_.jpg";

                          return (
                            <div
                              key={itemKey}
                              className="flex gap-3 border-b border-dashed border-gray-200 pb-3 last:border-b-0 last:pb-0"
                            >
                              <img
                                src={image}
                                alt={product?.title || "Product"}
                                className="h-14 w-14 rounded-md object-cover border border-gray-200"
                              />
                              <div className="space-y-1">
                                <p className="font-medium text-gray-900">
                                  {product?.title || "Product"}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Qty: {item?.quantity || 0} | Size: {item?.size || "N/A"}
                                </p>
                                <p className="text-xs text-gray-600">
                                  Item Total: {formatCurrency(getOrderTotal(item))}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </StyledTableCell>

                    <StyledTableCell>
                      <div className="space-y-1 min-w-56">
                        <p className="font-medium">{order?.shippingAddress?.name || "-"}</p>
                        <p className="text-sm text-gray-600">
                          {order?.shippingAddress?.mobile || "-"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {getAddressText(order?.shippingAddress)}
                        </p>
                      </div>
                    </StyledTableCell>

                    <StyledTableCell>
                      <div className="space-y-2 min-w-32">
                        <Chip
                          label={formatStatusLabel(order?.paymentStatus)}
                          color={getPaymentStatusColor(order?.paymentStatus)}
                          size="small"
                        />
                        <p className="text-xs text-gray-500">
                          {formatPaymentMethodLabel(order?.paymentMethod)}
                        </p>
                        <p className="text-sm font-medium text-gray-700">
                          {formatCurrency(order?.totalSellingPrice)}
                        </p>
                      </div>
                    </StyledTableCell>

                    <StyledTableCell>
                      <Chip
                        label={formatStatusLabel(order?.orderStatus)}
                        color={getOrderStatusColor(order?.orderStatus)}
                        size="small"
                      />
                    </StyledTableCell>

                    <StyledTableCell>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={(event) => handleClick(event, orderId)}
                        disabled={loading || isCancelled || isDelivered}
                      >
                        {isCancelled ? "Cancelled" : isDelivered ? "Delivered" : "Update"}
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            "aria-labelledby": "seller-order-status-menu",
          },
        }}
      >
        {ORDER_STATUS_OPTIONS.map((status) => (
          <MenuItem key={status} onClick={() => handleUpdateStatus(status)}>
            <Chip label={formatStatusLabel(status)} color={getOrderStatusColor(status)} size="small" />
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
