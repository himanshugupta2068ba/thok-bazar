type RouteLoaderProps = {
  label?: string;
};

export const RouteLoader = ({ label = "Loading page..." }: RouteLoaderProps) => {
  return (
    <div className="flex min-h-[30vh] items-center justify-center px-4 py-10">
      <div className="rounded-full border border-slate-200 bg-white/90 px-5 py-3 text-sm font-medium text-slate-500 shadow-sm">
        {label}
      </div>
    </div>
  );
};
