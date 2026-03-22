import type { ReactNode } from "react";
import { Footer } from "../customer/Footer/Footer";
import { Navbar } from "../customer/Navbar/Navbar";

export const PublicStorefrontLayout = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#f5fffc_38%,#ffffff_100%)]">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};
