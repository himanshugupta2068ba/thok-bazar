import { AutoAwesome } from "@mui/icons-material";
import { lazy, Suspense, useState } from "react";

const CustomerAssistantWidget = lazy(() =>
  import("./CustomerAssistantWidget").then((module) => ({
    default: module.CustomerAssistantWidget,
  })),
);

export const CustomerAssistant = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open ? (
        <Suspense fallback={null}>
          <CustomerAssistantWidget onClose={() => setOpen(false)} />
        </Suspense>
      ) : (
        <div className="fixed bottom-5 right-4 z-[160] sm:right-6">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open AI assistant"
            className="group flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-full bg-slate-900 px-4 py-3 text-white shadow-[0_20px_45px_rgba(15,23,42,0.22)] transition hover:bg-teal-700"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/12">
              <AutoAwesome className="transition group-hover:scale-110" />
            </span>
            <span className="min-w-0 pr-1 text-left">
              <span className="block text-sm font-semibold leading-tight">Ask AI</span>
              <span className="hidden pt-0.5 text-xs leading-tight text-slate-200 sm:block">
                Find products or get support
              </span>
            </span>
          </button>
        </div>
      )}
    </>
  );
};
