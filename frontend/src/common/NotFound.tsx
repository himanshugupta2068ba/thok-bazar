import { Button } from "@mui/material";
import { Link } from "react-router";
import { SoftPageBackground } from "./SoftPageBackground";

export const NotFound = ({ area = "store" }: { area?: "store" | "seller" | "admin" }) => {
  const destination = area === "seller" ? "/seller" : area === "admin" ? "/admin" : "/";
  return (
    <SoftPageBackground className="flex min-h-[65vh] items-center justify-center px-5 py-12">
      <div className="w-full max-w-lg rounded-2xl border border-teal-100 bg-white p-6 text-center shadow-sm sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-600">404</p>
        <h1 className="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl">This page could not be found</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-600 sm:text-base">
          The address may be incorrect, or the page may have moved.
        </p>
        <Button component={Link} to={destination} variant="contained" sx={{ mt: 3 }}>
          Go to {area === "store" ? "home" : `${area} dashboard`}
        </Button>
      </div>
    </SoftPageBackground>
  );
};
