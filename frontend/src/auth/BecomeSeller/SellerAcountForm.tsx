
import { Alert, Button, Step, StepLabel, Stepper } from "@mui/material";
import { useFormik } from "formik"
import { useState } from "react";
import { BecomeSellerStep1 } from "./BecomeSellerStep1";
import { BecomeSellerStep2 } from "./BecomeSellerStep2";
import { BecomeSellerStep3 } from "./BecomeSellerStep3";
import { BecomeSellerStep4 } from "./BecomeSellerStep4";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import { clearSellerError, createSeller } from "../../Redux Toolkit/featurs/seller/sellerAuthentication";

const steps = ["Mobile Verification & TaxDetails", "Pickup Address", "Bank Details", "Business Details"];

interface SellerAccountFormProps {
    onSuccess?: () => void;
}

export const SellerAccountForm = ({ onSuccess }: SellerAccountFormProps) => {
    const [activeStep, setActiveStep] = useState(0);

    const dispatch = useAppDispatch();
    const { seller } = useAppSelector((state) => state);
    const formik = useFormik({
        initialValues: {
            mobile: "",
            otp: "",
            GSTIN: "",
            pickupAddress: {
                name: "",
                mobile: "",
                pincode: "",
                locality: "",
                address: "",
                city: "",
                state: "",
            },
            bankDetails: {
                accountNumber: "",
                IFSC: "",
                bankName: "",
            },
            businessDetails: {
                businessName: "",
                businessEmail: "",
                businessType: "",
                bussinessMobile: "",
                logo: "",
                bussinessAddress: ""
            },
            Password: "",
            confirmPassword: "",
            sellerName: "",
            email: "",
        },
        onSubmit: async (values) => {
            const payload = {
                ...values,
                password: values.Password,
                businessDetails: {
                    ...values.businessDetails,
                    businessMobile: values.businessDetails.bussinessMobile,
                    businessAddress: values.businessDetails.bussinessAddress,
                },
                bankDetails: {
                    ...values.bankDetails,
                    ifscCode: values.bankDetails.IFSC,
                },
            };

            try {
                await dispatch(createSeller(payload)).unwrap();
                onSuccess?.();
            } catch (error) {
                console.log("Create seller failed:", error);
            }
        }

    });

    const getErrorMessage = () => {
        if (!seller.error) return null;
        if (typeof seller.error === "string") return seller.error;
        if (typeof seller.error === "object" && (seller.error as any)?.error) return (seller.error as any).error;
        if (typeof seller.error === "object" && (seller.error as any)?.message) return (seller.error as any).message;
        return "An error occurred";
    };

    return (
        <div>
            <h1 className="text-2xl font-medium text-center mb-5 mt-4">Create Your Seller Account</h1>
            {seller.error && getErrorMessage() && (
                <Alert severity="error" sx={{ marginBottom: 2 }} onClose={() => dispatch(clearSellerError())}>
                    {getErrorMessage()}
                </Alert>
            )}
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label, index) => (
                    <Step key={index}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))
                }
            </Stepper>
            <div className="mt-20 space-y-10 mb-2">
                {
                    activeStep == 0 ? (<BecomeSellerStep1 formik={formik} />) :
                        activeStep == 1 ? (<BecomeSellerStep2 formik={formik} />) :
                            activeStep == 2 ? (<BecomeSellerStep3 formik={formik} />) : (<BecomeSellerStep4 formik={formik} />)
                }
            </div>
            <div className="flex items-center justify-between mt-8">
    <Button 
        variant="contained" 
        disabled={activeStep === 0} 
        onClick={() => setActiveStep(activeStep - 1)}
    >
        Previous
    </Button>
    <Button 
        variant="contained" 
        disabled={seller.loading}
        onClick={() => {
            if (activeStep === steps.length - 1) {
                formik.handleSubmit();
            } else {
                // Validate current step before proceeding
                formik.validateForm().then(errors => {
                    if (Object.keys(errors).length === 0) {
                        setActiveStep(activeStep + 1);
                    }
                });
            }
        }}
    >
        {seller.loading ? "Please wait..." : activeStep === steps.length - 1 ? 'Submit' : 'Next'}
    </Button>
</div>
        </div>
    )
}