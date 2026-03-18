
import { Stepper, Step, StepLabel, StepContent, Typography, Box, ThemeProvider } from "@mui/material";
import { customTheme } from "../../../Theme/custom_theme";

interface OrderStepperProps {
  currentStatus?: string;
  isCancelled?: boolean;
}

const steps = [
  {
    label: "Order Placed",
    description: "Your order has been placed",
    value: "PLACED",
  },
  {
    label: "Order Confirmed",
    description: "Your order has been confirmed",
    value: "CONFIRMED",
  },
  {
    label: "Out for Delivery",
    description: "Your order is out for delivery",
    value: "SHIPPED",
  },
  {
    label: "Delivered",
    description: "Your order has been delivered",
    value: "DELIVERED",
  },
];

const cancelledSteps = [
  {
    label: "Order Placed",
    description: "Your order has been placed",
    value: "PLACED",
  },
  {
    label: "Order Cancelled",
    description: "Your order has been cancelled",
    value: "CANCELLED",
  },
];

export const OrderStepper = ({ currentStatus = "PENDING", isCancelled = false }: OrderStepperProps) => {
  const stepsToDisplay = isCancelled ? cancelledSteps : steps;

  const statusAlias: Record<string, string> = {
    PENDING: "PLACED",
  };

  const normalizedStatus = statusAlias[currentStatus] || currentStatus;

  const getCurrentStep = () => {
    const stepIndex = stepsToDisplay.findIndex((step) => step.value === normalizedStatus);
    return stepIndex >= 0 ? stepIndex : 0;
  };

  const activeStep = getCurrentStep();

  return (
    <ThemeProvider theme={customTheme}>
      <Box sx={{ maxWidth: "100%", padding: 2 }}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {stepsToDisplay.map((step, index) => (
            <Step key={step.value}>
              <StepLabel
                sx={{
                  "& .MuiStepIcon-root": {
                    color: index <= activeStep ? customTheme.palette.primary.main : "inherit",
                  },
                }}
              >
                {step.label}
              </StepLabel>
              <StepContent>
                <Typography variant="body2" color="textSecondary">
                  {step.description}
                </Typography>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Box>
    </ThemeProvider>
  );
};
