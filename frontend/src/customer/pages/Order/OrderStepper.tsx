
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
    value: "Placed",
  },
  {
    label: "Order Confirmed",
    description: "Your order has been confirmed",
    value: "Confirmed",
  },
  {
    label: "Out for Delivery",
    description: "Your order is out for delivery",
    value: "Out for Delivery",
  },
  {
    label: "Delivered",
    description: "Your order has been delivered",
    value: "Delivered",
  },
];

const cancelledSteps = [
  {
    label: "Order Placed",
    description: "Your order has been placed",
    value: "Placed",
  },
  {
    label: "Order Cancelled",
    description: "Your order has been cancelled",
    value: "Cancelled",
  },
];

export const OrderStepper = ({ currentStatus = "Placed", isCancelled = false }: OrderStepperProps) => {
  const stepsToDisplay = isCancelled ? cancelledSteps : steps;

  const getCurrentStep = () => {
    return stepsToDisplay.findIndex((step) => step.value === currentStatus);
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
