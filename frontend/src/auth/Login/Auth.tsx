import { Button, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import { resetAuthFlow } from "../../Redux Toolkit/featurs/Auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import { LoginForm } from "./LoginForm";
import { SignUp } from "./SignUpForm";

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(false);
  const { auth } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();

  const handleModeChange = (nextMode: boolean) => {
    setIsLogin(nextMode);
    dispatch(resetAuthFlow());
  };

  useEffect(() => {
    return () => {
      dispatch(resetAuthFlow());
    };
  }, [dispatch]);

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center">
        <section className="w-full rounded-[36px] border border-slate-200 bg-white p-3 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
          <div className="rounded-[30px] bg-[linear-gradient(180deg,#fbfffe_0%,#f8fafc_100%)] p-5 sm:p-6">
            <h2 className="text-center text-3xl font-semibold tracking-tight text-slate-900">
              {isLogin ? "Customer Login" : "Create Account"}
            </h2>

            <div className="mt-6 flex justify-center">
              <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 shadow-sm">
                <Button
                  variant={isLogin ? "text" : "contained"}
                  onClick={() => handleModeChange(false)}
                  sx={{
                    borderRadius: "999px",
                    px: 3,
                    textTransform: "none",
                    fontWeight: 700,
                    boxShadow: !isLogin ? "none" : undefined,
                  }}
                >
                  Sign Up
                </Button>
                <Button
                  variant={isLogin ? "contained" : "text"}
                  onClick={() => handleModeChange(true)}
                  sx={{
                    borderRadius: "999px",
                    px: 3,
                    textTransform: "none",
                    fontWeight: 700,
                    boxShadow: isLogin ? "none" : undefined,
                  }}
                >
                  Login
                </Button>
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
              {isLogin ? <LoginForm /> : <SignUp />}
            </div>

            <p className="mt-5 text-center text-sm text-slate-600">
              {isLogin ? "New here?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => handleModeChange(!isLogin)}
                className="font-semibold text-teal-700 transition hover:text-teal-800"
              >
                {isLogin ? "Create one now" : "Login instead"}
              </button>
            </p>
          </div>
        </section>
      </div>

      <Snackbar
        open={auth.otpSent}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        message={isLogin ? "Login OTP sent to your email" : "Signup OTP sent to your email"}
      />
    </section>
  );
};
