import type { PropsWithChildren } from "react";

interface SoftPageBackgroundProps extends PropsWithChildren {
  className?: string;
}

export const SoftPageBackground = ({
  children,
  className = "",
}: SoftPageBackgroundProps) => {
  return (
    <section className={`relative isolate w-full ${className}`}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.06),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.04),_transparent_38%),linear-gradient(180deg,#fbfefc_0%,#f7fbff_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-32 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.65),_transparent_72%)]"
      />
      {children}
    </section>
  );
};
