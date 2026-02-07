import { Card, Divider } from "@mui/material"
import TransactionTables from "../Transaction/TransactionTable"

export const Payment = () => {
  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">Payments</h1>
        <div className="space-y-5">
          <Card className="p-5 rounded-md">
            <h1>Total Earning</h1>
<h1 className="font-bold text-xl">₹132432</h1>
<Divider />
<p className="py-2">Last Payment:<strong>₹5000</strong></p>
          </Card>
          <TransactionTables />
        </div>
    </div>
  )
}