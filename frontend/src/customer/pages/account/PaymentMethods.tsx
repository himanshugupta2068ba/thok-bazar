import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";

type PaymentMethod = {
  id: string;
  cardHolderName: string;
  cardBrand: string;
  cardLast4: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
};

const PAYMENT_METHODS_STORAGE_KEY = "customer_payment_methods";

const buildCardBrand = (cardNumber: string) => {
  if (cardNumber.startsWith("4")) return "Visa";
  if (/^5[1-5]/.test(cardNumber)) return "Mastercard";
  if (/^3[47]/.test(cardNumber)) return "Amex";
  if (/^6/.test(cardNumber)) return "RuPay";
  return "Card";
};

const maskCardNumber = (last4: string) => `**** **** **** ${last4}`;

export const PaymentMethods = () => {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formValues, setFormValues] = useState({
    cardHolderName: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(PAYMENT_METHODS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setMethods(parsed);
        }
      }
    } catch {
      setMethods([]);
    }
  }, []);

  const hasMethods = methods.length > 0;

  const sortedMethods = useMemo(
    () => [...methods].sort((a, b) => Number(b.isDefault) - Number(a.isDefault)),
    [methods],
  );

  const persistMethods = (nextMethods: PaymentMethod[]) => {
    setMethods(nextMethods);
    localStorage.setItem(PAYMENT_METHODS_STORAGE_KEY, JSON.stringify(nextMethods));
  };

  const handleAddMethod = () => {
    setErrorMessage("");

    const cardNumber = formValues.cardNumber.replace(/\s+/g, "").trim();
    const expiryMonth = formValues.expiryMonth.trim();
    const expiryYear = formValues.expiryYear.trim();

    if (!formValues.cardHolderName.trim()) {
      setErrorMessage("Card holder name is required.");
      return;
    }

    if (!/^\d{16}$/.test(cardNumber)) {
      setErrorMessage("Card number must be exactly 16 digits.");
      return;
    }

    if (!/^(0?[1-9]|1[0-2])$/.test(expiryMonth)) {
      setErrorMessage("Enter a valid expiry month (1-12).");
      return;
    }

    if (!/^\d{4}$/.test(expiryYear)) {
      setErrorMessage("Enter a valid 4-digit expiry year.");
      return;
    }

    const nextMethod: PaymentMethod = {
      id: `${Date.now()}`,
      cardHolderName: formValues.cardHolderName.trim(),
      cardBrand: buildCardBrand(cardNumber),
      cardLast4: cardNumber.slice(-4),
      expiryMonth: expiryMonth.padStart(2, "0"),
      expiryYear,
      isDefault: methods.length === 0,
    };

    persistMethods([...methods, nextMethod]);
    setIsDialogOpen(false);
    setFormValues({ cardHolderName: "", cardNumber: "", expiryMonth: "", expiryYear: "" });
  };

  const handleDelete = (id: string) => {
    const remaining = methods.filter((method) => method.id !== id);
    if (remaining.length > 0 && !remaining.some((method) => method.isDefault)) {
      remaining[0].isDefault = true;
    }
    persistMethods([...remaining]);
  };

  const handleSetDefault = (id: string) => {
    const nextMethods = methods.map((method) => ({
      ...method,
      isDefault: method.id === id,
    }));
    persistMethods(nextMethods);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Saved Payment Methods</h2>
        <Button variant="contained" onClick={() => setIsDialogOpen(true)}>
          Add New Card
        </Button>
      </div>

      {!hasMethods && (
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6">
          <p className="text-sm text-gray-700">No saved payment methods yet.</p>
          <p className="mt-2 text-sm text-gray-500">
            Add a card to speed up checkout. Your card details are stored locally in this browser.
          </p>
        </div>
      )}

      <Stack spacing={1.5}>
        {sortedMethods.map((method) => (
          <div
            key={method.id}
            className="rounded-lg border border-gray-200 p-4 flex items-center justify-between gap-3"
          >
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium">{method.cardBrand}</p>
                {method.isDefault && <Chip label="Default" color="success" size="small" />}
              </div>
              <p className="text-sm text-gray-700">{maskCardNumber(method.cardLast4)}</p>
              <p className="text-xs text-gray-500">
                {method.cardHolderName} | Expires {method.expiryMonth}/{method.expiryYear}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {!method.isDefault && (
                <Button size="small" variant="outlined" onClick={() => handleSetDefault(method.id)}>
                  Set Default
                </Button>
              )}
              <Button size="small" color="error" onClick={() => handleDelete(method.id)}>
                Remove
              </Button>
            </div>
          </div>
        ))}
      </Stack>

      <div className="mt-6 rounded-lg border border-teal-100 bg-teal-50 p-4">
        <p className="text-sm font-medium text-teal-700">Checkout Support</p>
        <p className="text-sm text-teal-600 mt-1">
          You can still pay using UPI, cards, net banking, and cash on delivery during checkout.
        </p>
      </div>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add Payment Method</DialogTitle>
        <DialogContent>
          <Stack spacing={2} className="pt-2">
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            <TextField
              label="Card Holder Name"
              value={formValues.cardHolderName}
              onChange={(event) =>
                setFormValues((prev) => ({ ...prev, cardHolderName: event.target.value }))
              }
              fullWidth
            />
            <TextField
              label="Card Number"
              value={formValues.cardNumber}
              onChange={(event) =>
                setFormValues((prev) => ({ ...prev, cardNumber: event.target.value }))
              }
              inputProps={{ maxLength: 16 }}
              fullWidth
            />
            <div className="grid grid-cols-2 gap-3">
              <TextField
                label="Expiry Month"
                value={formValues.expiryMonth}
                onChange={(event) =>
                  setFormValues((prev) => ({ ...prev, expiryMonth: event.target.value }))
                }
                fullWidth
              />
              <TextField
                label="Expiry Year"
                value={formValues.expiryYear}
                onChange={(event) =>
                  setFormValues((prev) => ({ ...prev, expiryYear: event.target.value }))
                }
                fullWidth
              />
            </div>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddMethod}>
            Save Card
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
