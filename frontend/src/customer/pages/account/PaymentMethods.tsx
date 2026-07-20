import { CreditCard, LockOutlined, ShoppingBagOutlined } from "@mui/icons-material";
import { Alert, Button, Card } from "@mui/material";
import { useNavigate } from "react-router";

export const PaymentMethods = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Payment methods</h2>
        <p className="mt-1 text-sm text-gray-500">Choose a secure payment method when placing an order.</p>
      </div>

      <Alert severity="info">
        For your security, GrowLine does not store card numbers in your browser or database.
      </Alert>

      <div className="grid gap-3 sm:grid-cols-2">
        <Card variant="outlined" className="p-4 sm:p-5">
          <CreditCard color="primary" />
          <h3 className="mt-3 font-semibold">Online payment</h3>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Pay through Razorpay using supported cards, UPI, net banking, or wallets.
          </p>
        </Card>
        <Card variant="outlined" className="p-4 sm:p-5">
          <ShoppingBagOutlined color="primary" />
          <h3 className="mt-3 font-semibold">Cash on delivery</h3>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Select cash on delivery at checkout when it is available for your order.
          </p>
        </Card>
      </div>

      <div className="flex items-start gap-3 rounded-xl bg-teal-50 p-4 text-sm text-teal-800">
        <LockOutlined fontSize="small" />
        Payment details are entered only on the payment provider's secure page.
      </div>

      <Button variant="contained" onClick={() => navigate('/cart')}>Go to cart</Button>
    </div>
  );
};
