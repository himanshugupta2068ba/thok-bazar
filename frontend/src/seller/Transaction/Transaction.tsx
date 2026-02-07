import TransactionTables from "./TransactionTable"

export const Transaction = () => {
  return (
    <div className="p-5">
        <h1 className="text-2xl font-bold pb-2">Transaction</h1>
        <TransactionTables />
    </div>
  )
}