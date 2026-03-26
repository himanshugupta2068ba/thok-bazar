import { Alert, Button } from "@mui/material";
import { useFormik } from "formik"
import { useState } from "react";
import { BecomeSellerStep1 } from "./BecomeSellerStep1";
import { BecomeSellerStep2 } from "./BecomeSellerStep2";
import { BecomeSellerStep3 } from "./BecomeSellerStep3";
import { BecomeSellerStep4 } from "./BecomeSellerStep4";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import { clearSellerError, createSeller } from "../../Redux Toolkit/featurs/seller/sellerAuthentication";

const steps = [
    {
        label: "Contact & Tax",
        title: "Contact Details",
        description: "Enter your mobile number and GSTIN.",
    },
    {
        label: "Pickup Address",
        title: "Pickup Address",
        description: "Enter the address used for pickup and delivery operations.",
    },
    {
        label: "Bank Details",
        title: "Bank Details",
        description: "Enter the account details for payouts.",
    },
    {
        label: "Business Details",
        title: "Business Details",
        description: "Enter your business details and seller account credentials.",
    },
];

interface SellerAccountFormProps {
    onSuccess?: () => void;
}

export const SellerAccountForm = ({ onSuccess }: SellerAccountFormProps) => {
    const [activeStep, setActiveStep] = useState(0);

    const dispatch = useAppDispatch();
    const { seller } = useAppSelector((state) => state);
    const currentStep = steps[activeStep];
    const progress = ((activeStep + 1) / steps.length) * 100;
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
        <div className="mx-auto max-w-4xl p-4 sm:p-5 lg:p-6">
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.05)] sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
                            Seller Signup
                        </p>
                        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                            Create Seller Account
                        </h1>
                        <p className="mt-2 text-sm text-slate-600">
                            Complete the steps below.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                        Step {activeStep + 1} of {steps.length}
                    </div>
                </div>

                <div className="mt-4 h-2 rounded-full bg-slate-200">
                    <div
                        className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {steps.map((step, index) => {
                        const isCurrent = index === activeStep;
                        const isComplete = index < activeStep;

                        return (
                            <div
                                key={step.label}
                                className={`rounded-2xl border px-4 py-3 ${
                                    isCurrent
                                        ? "border-emerald-300 bg-emerald-50"
                                        : isComplete
                                            ? "border-emerald-100 bg-emerald-50/60"
                                            : "border-slate-200 bg-slate-50"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                                            isCurrent
                                                ? "bg-emerald-600 text-white"
                                                : isComplete
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : "bg-slate-200 text-slate-600"
                                        }`}
                                    >
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">{step.label}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {seller.error && getErrorMessage() && (
                    <Alert sx={{ mt: 4 }} severity="error" onClose={() => dispatch(clearSellerError())}>
                        {getErrorMessage()}
                    </Alert>
                )}

                <div className="mt-5 rounded-[24px] border border-slate-200 bg-slate-50 p-4 sm:p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                        Current Step
                    </p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-900">{currentStep.title}</h2>
                    <p className="mt-1 text-sm text-slate-600">{currentStep.description}</p>
                </div>

                <div className="mt-5 rounded-[24px] border border-slate-200 bg-white p-4 sm:p-6">
                    {activeStep === 0 ? (
                        <BecomeSellerStep1 formik={formik} />
                    ) : activeStep === 1 ? (
                        <BecomeSellerStep2 formik={formik} />
                    ) : activeStep === 2 ? (
                        <BecomeSellerStep3 formik={formik} />
                    ) : (
                        <BecomeSellerStep4 formik={formik} />
                    )}
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Button
                        variant="outlined"
                        disabled={activeStep === 0}
                        onClick={() => setActiveStep(activeStep - 1)}
                        sx={{
                            minWidth: 120,
                            py: 1.4,
                            textTransform: "none",
                            fontWeight: 700,
                            borderRadius: "16px",
                        }}
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
                                formik.validateForm().then(errors => {
                                    if (Object.keys(errors).length === 0) {
                                        setActiveStep(activeStep + 1);
                                    }
                                });
                            }
                        }}
                        sx={{
                            minWidth: 150,
                            py: 1.4,
                            textTransform: "none",
                            fontWeight: 700,
                            borderRadius: "16px",
                            boxShadow: "none",
                        }}
                    >
                        {seller.loading ? "Please wait..." : activeStep === steps.length - 1 ? "Create Account" : "Next"}
                    </Button>
                </div>
            </div>
        </div>
    )
}
