import { Alert, Card, CircularProgress } from "@mui/material";
import { useEffect, useMemo } from "react";
import TransactionTables from "../Transaction/TransactionTable";
import { fetchSellerTransactions } from "../../Redux Toolkit/featurs/seller/transactionSlice";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import {
  formatCurrency,
  formatDateTime,
  formatPaymentMethodLabel,
  getTransactionAmount,
  getTransactionStatus,
  isVisibleSellerTransaction,
} from "../shared/sellerViewUtils";

export const Payment = () => {
  const dispatch = useAppDispatch();
  const { transactions, loading: transactionLoading, error: transactionError } = useAppSelector(
    (state) => state.sellerTransactions,
  );
  const sellerJwt = localStorage.getItem("sellerJwt");

  useEffect(() => {
    if (sellerJwt) {
      dispatch(fetchSellerTransactions(sellerJwt));
    }
  }, [dispatch, sellerJwt]);

  const safeTransactions = (Array.isArray(transactions) ? transactions : []).filter(isVisibleSellerTransaction);
  const sortedTransactions = useMemo(
    () =>
      [...safeTransactions].sort(
        (first, second) =>
          new Date(second?.createdAt || second?.date || 0).getTime() -
          new Date(first?.createdAt || first?.date || 0).getTime(),
      ),
    [safeTransactions],
  );
  const receivedTransactions = useMemo(
    () => sortedTransactions.filter((transaction) => getTransactionStatus(transaction) === "RECEIVED"),
    [sortedTransactions],
  );
  const refundedTransactions = useMemo(
    () => sortedTransactions.filter((transaction) => getTransactionStatus(transaction) === "REFUNDED"),
    [sortedTransactions],
  );
  const latestTransaction = sortedTransactions[0];
  const totalReceived = receivedTransactions.reduce(
    (sum, transaction) => sum + getTransactionAmount(transaction),
    0,
  );
  const totalRefunded = refundedTransactions.reduce(
    (sum, transaction) => sum + getTransactionAmount(transaction),
    0,
  );
  const netEarnings = Math.max(0, totalReceived);
  const totalTransactions = receivedTransactions.length;
  const totalRefundTransactions = refundedTransactions.length;
  const isInitialLoading = transactionLoading && !sortedTransactions.length;

  if (isInitialLoading) {
    return (
      <div className="flex justify-center py-10">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">Payments</h1>
      <p className="pb-5 text-sm text-gray-500">
        Track customer payments received against your live orders.
      </p>

      {transactionError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {transactionError}
        </Alert>
      )}

      <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="rounded-md p-5">
            <p className="text-sm text-gray-500">Received Amount</p>
            <h2 className="pt-2 text-2xl font-bold text-teal-700">
              {formatCurrency(totalReceived)}
            </h2>
          </Card>

          <Card className="rounded-md p-5">
            <p className="text-sm text-gray-500">Refunded Amount</p>
            <h2 className="pt-2 text-2xl font-bold text-amber-700">
              {formatCurrency(totalRefunded)}
            </h2>
          </Card>

          <Card className="rounded-md p-5">
            <p className="text-sm text-gray-500">Net Earnings</p>
            <h2 className="pt-2 text-2xl font-bold">{formatCurrency(netEarnings)}</h2>
          </Card>

          <Card className="rounded-md p-5">
            <p className="text-sm text-gray-500">Active Payments</p>
            <h2 className="pt-2 text-2xl font-bold">{totalTransactions}</h2>
            <p className="pt-1 text-xs text-gray-500">
              Refunded: {totalRefundTransactions}
            </p>
          </Card>
        </div>

        <Card className="rounded-md p-5">
          <p className="text-sm text-gray-500">Latest Transaction</p>
          <div className="space-y-1 pt-2">
            <h2 className="text-xl font-bold text-teal-700">
              {latestTransaction ? formatCurrency(getTransactionAmount(latestTransaction)) : "Rs. 0"}
            </h2>
            <p className="text-sm text-gray-600">
              {latestTransaction
                ? `${getTransactionStatus(latestTransaction) === "REFUNDED" ? "Updated" : "Received"} on ${formatDateTime(latestTransaction?.createdAt || latestTransaction?.date)}`
                : "No successful payments received yet."}
            </p>
            {latestTransaction?.order?._id && (
              <p className="break-all text-sm text-gray-600">
                Order ID: {latestTransaction.order._id}
              </p>
            )}
            <p className="break-all text-sm text-gray-600">
              Status: {latestTransaction ? getTransactionStatus(latestTransaction) : "-"}
            </p>
            {(latestTransaction?.transactionId || latestTransaction?._id) && (
              <p className="break-all text-sm text-gray-600">
                Transaction ID: {latestTransaction.transactionId || latestTransaction._id}
              </p>
            )}
            <p className="break-all text-sm text-gray-600">
              Payment Method: {formatPaymentMethodLabel(latestTransaction?.order?.paymentMethod)}
            </p>
          </div>
        </Card>

        <TransactionTables
          transactions={sortedTransactions}
          loading={transactionLoading}
          error={transactionError}
        />
      </div>
    </div>
  );
};
