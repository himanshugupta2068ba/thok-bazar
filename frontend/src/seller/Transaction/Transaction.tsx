import { useEffect } from "react";
import TransactionTables from "./TransactionTable";
import { fetchSellerTransactions } from "../../Redux Toolkit/featurs/seller/transactionSlice";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";

export const Transaction = () => {
  const dispatch = useAppDispatch();
  const { transactions, loading, error } = useAppSelector((state) => state.sellerTransactions);
  const sellerJwt = localStorage.getItem("sellerJwt");

  useEffect(() => {
    if (sellerJwt) {
      dispatch(fetchSellerTransactions(sellerJwt));
    }
  }, [dispatch, sellerJwt]);

  return (
    <div className="p-5">
      <h1 className="pb-2 text-2xl font-bold">Transactions</h1>
      <p className="pb-5 text-sm text-gray-500">
        Live payment transactions received from customer orders.
      </p>
      <TransactionTables transactions={transactions} loading={loading} error={error} />
    </div>
  );
};
