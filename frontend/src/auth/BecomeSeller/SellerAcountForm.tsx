
import { Button, Step, StepLabel, Stepper } from "@mui/material";
import { useFormik } from "formik"
import { useState } from "react";
import { BecomeSellerStep1 } from "./BecomeSellerStep1";
import { BecomeSellerStep2 } from "./BecomeSellerStep2";
import { BecomeSellerStep3 } from "./BecomeSellerStep3";
import { BecomeSellerStep4 } from "./BecomeSellerStep4";

const steps = ["Mobile Verification & TaxDetails", "Pickup Address", "Bank Details", "Business Details"];
export const SellerAccountForm = () => {
    const [activeStep, setActiveStep] = useState(0);
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
        onSubmit: (values) => {
            console.log(values);
        }
    })
    return (
        <div>
            <h1 className="text-2xl font-medium text-center mb-5 mt-4">Create Your Seller Account</h1>
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
        {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
    </Button>
</div>
        </div>
    )
}