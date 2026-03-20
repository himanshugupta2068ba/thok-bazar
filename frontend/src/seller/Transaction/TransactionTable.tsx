import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Alert, Button, Chip, CircularProgress } from "@mui/material";
import { useState } from "react";
import {
  formatCurrency,
  formatDateTime,
  formatPaymentMethodLabel,
  formatStatusLabel,
  getCustomerContact,
  getCustomerName,
  getOrderStatusColor,
  getPaymentStatusColor,
  getTransactionAmount,
  getTransactionStatus,
  isVisibleSellerTransaction,
} from "../shared/sellerViewUtils";
import { useAppDispatch } from "../../Redux Toolkit/store";
import {
  fetchSellerTransactions,
  refundSellerTransaction,
} from "../../Redux Toolkit/featurs/seller/transactionSlice";
import { fetchSellerOrders } from "../../Redux Toolkit/featurs/seller/sellerOrderSlice";
import { fetchSellerReports } from "../../Redux Toolkit/featurs/seller/sellerSlice";

interface TransactionTableProps {
  transactions: any[];
  loading: boolean;
  error: string | null;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
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

export default function TransactionTables({
  transactions,
  loading,
  error,
}: TransactionTableProps) {
  const dispatch = useAppDispatch();
  const sellerJwt = localStorage.getItem("sellerJwt");
  const safeTransactions = (Array.isArray(transactions) ? transactions : []).filter(isVisibleSellerTransaction);
  const [processingTransactionId, setProcessingTransactionId] = useState<string | null>(null);

  const handleRefund = async (transactionId: string) => {
    if (!sellerJwt) {
      return;
    }

    setProcessingTransactionId(transactionId);

    const resultAction = await dispatch(refundSellerTransaction({ transactionId, jwt: sellerJwt }));

    if (refundSellerTransaction.fulfilled.match(resultAction)) {
      await Promise.all([
        dispatch(fetchSellerTransactions(sellerJwt)),
        dispatch(fetchSellerOrders(sellerJwt)),
        dispatch(fetchSellerReports(sellerJwt)),
      ]);
    }

    setProcessingTransactionId(null);
  };

  if (loading && !safeTransactions.length) {
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
        <Table sx={{ minWidth: 900 }} aria-label="seller transactions table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Date</StyledTableCell>
              <StyledTableCell>Transaction ID</StyledTableCell>
              <StyledTableCell>Customer</StyledTableCell>
              <StyledTableCell>Order</StyledTableCell>
              <StyledTableCell>Amount</StyledTableCell>
              <StyledTableCell>Transaction Status</StyledTableCell>
              <StyledTableCell>Order Status</StyledTableCell>
              <StyledTableCell>Action</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {!safeTransactions.length ? (
              <StyledTableRow>
                <StyledTableCell align="center" colSpan={8}>
                  No valid customer payments found yet.
                </StyledTableCell>
              </StyledTableRow>
            ) : (
              safeTransactions.map((transaction: any) => {
                const transactionId = String(transaction?._id || transaction?.id || "");
                const order = transaction?.order;
                const transactionStatus = getTransactionStatus(transaction);
                const displayTransactionId =
                  transaction?.transactionId || transaction?.paymentLinkId || transactionId;
                const isRefunded = transactionStatus === "REFUNDED";
                const isDelivered = order?.orderStatus === "DELIVERED";
                const isProcessing = processingTransactionId === transactionId;

                return (
                  <StyledTableRow key={transactionId}>
                    <StyledTableCell component="th" scope="row">
                      <p className="min-w-40 font-medium">
                        {formatDateTime(transaction?.createdAt || transaction?.date)}
                      </p>
                    </StyledTableCell>

                    <StyledTableCell>
                      <div className="space-y-1 min-w-44">
                        <p className="font-medium break-all">{displayTransactionId}</p>
                        {transaction?.paymentLinkId && transaction?.paymentLinkId !== displayTransactionId && (
                          <p className="text-xs text-gray-500 break-all">
                            Link: {transaction.paymentLinkId}
                          </p>
                        )}
                      </div>
                    </StyledTableCell>

                    <StyledTableCell>
                      <div className="space-y-1 min-w-40">
                        <p className="font-semibold">{getCustomerName(transaction?.customer)}</p>
                        <p className="text-sm text-gray-600">{transaction?.customer?.email || "-"}</p>
                        <p className="text-sm text-gray-600">
                          {getCustomerContact(transaction?.customer)}
                        </p>
                      </div>
                    </StyledTableCell>

                    <StyledTableCell>
                      <div className="space-y-1 min-w-44">
                        <p className="font-medium break-all">{order?._id || "-"}</p>
                        <p className="text-sm text-gray-500">
                          {order?.totalItems || order?.orderItems?.length || 0} items
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatPaymentMethodLabel(order?.paymentMethod)}
                        </p>
                      </div>
                    </StyledTableCell>

                    <StyledTableCell>
                      <p className="font-semibold text-teal-700">
                        {formatCurrency(getTransactionAmount(transaction))}
                      </p>
                    </StyledTableCell>

                    <StyledTableCell>
                      <Chip
                        label={formatStatusLabel(transactionStatus)}
                        color={getPaymentStatusColor(transactionStatus)}
                        size="small"
                      />
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
                        color={isRefunded ? "success" : "warning"}
                        size="small"
                        disabled={isRefunded || isDelivered || isProcessing || loading}
                        onClick={() => handleRefund(transactionId)}
                      >
                        {isRefunded
                          ? "Refunded"
                          : isDelivered
                            ? "Delivered"
                            : isProcessing
                              ? "Updating..."
                              : "Mark Refunded"}
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
