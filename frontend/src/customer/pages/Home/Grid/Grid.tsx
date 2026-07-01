import { useAppSelector } from "../../../../Redux Toolkit/store";
import { selectGridHomeCategories } from "../../../../Redux Toolkit/featurs/coustomer/homeCategorySlice";
import { optimizeImageUrl } from "../../../../util/image";
import { useNavigate } from "react-router";

const Grid=()=>{
    const gridItems = useAppSelector(selectGridHomeCategories);
    const navigate = useNavigate();

    const getGridImage = (index: number, fallback: string) =>
        gridItems[index]?.image || fallback;

    const getGridName = (index: number, fallback: string) =>
        gridItems[index]?.name || fallback;

    const gridLayout = [
        {
            imageOptions: { width: 720, height: 1200, fit: "crop" as const },
            fallbackAlt: "Grid item 1",
            fallbackImage: "https://plus.unsplash.com/premium_photo-1682090778813-3938ba76ee57?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW5kaWFuJTIwZ3Jvb218ZW58MHx8MHx8fDA%3D",
            wrapperClassName: "min-h-[320px] sm:min-h-[360px] lg:col-span-3 lg:row-span-12",
        },
        {
            imageOptions: { width: 560, height: 560, fit: "crop" as const },
            fallbackAlt: "Grid item 2",
            fallbackImage: "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YWNjZXNzb3J5fGVufDB8fDB8fHww",
            wrapperClassName: "min-h-[220px] lg:col-span-2 lg:row-span-6",
        },
        {
            imageOptions: { width: 900, height: 560, fit: "crop" as const },
            fallbackAlt: "Grid item 3",
            fallbackImage: "https://images.unsplash.com/photo-1732382642348-e0390efde4ff?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDZ8fGluZGlhbiUyMHdvbWFuJTIwd2l0aCUyMGpld2VsbGVyeXxlbnwwfHwwfHx8MA%3D%3D",
            wrapperClassName: "min-h-[240px] sm:col-span-2 lg:col-span-4 lg:row-span-6",
        },
        {
            imageOptions: { width: 720, height: 1200, fit: "crop" as const },
            fallbackAlt: "Grid item 4",
            fallbackImage: "https://images.unsplash.com/photo-1610047520958-b42ebcd2f6cb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGluZGlhbiUyMGJyaWRlfGVufDB8fDB8fHww",
            wrapperClassName: "min-h-[320px] sm:min-h-[360px] lg:col-span-3 lg:row-span-12",
        },
        {
            imageOptions: { width: 900, height: 560, fit: "crop" as const },
            fallbackAlt: "Grid item 5",
            fallbackImage: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHNob2VzfGVufDB8fDB8fHww",
            wrapperClassName: "min-h-[240px] lg:col-span-4 lg:row-span-6",
        },
        {
            imageOptions: { width: 560, height: 560, fit: "crop" as const },
            fallbackAlt: "Grid item 6",
            fallbackImage: "https://images.unsplash.com/photo-1676951334972-2e65e67f4cbe?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTJ8fHBlcmZ1bWV8ZW58MHx8MHx8fDA%3D",
            wrapperClassName: "min-h-[220px] sm:col-span-2 lg:col-span-2 lg:row-span-6",
        },
    ];

    const featuredItem = gridLayout[0];
    const featuredTitle = getGridName(0, "Fashion forward styles");

    return(
        <>
            <div className="px-4 sm:px-6 lg:hidden">
                <div className="relative h-[min(68vh,540px)] min-h-[390px] overflow-hidden rounded-[32px] bg-slate-950 shadow-[0_22px_55px_rgba(15,23,42,0.22)] sm:h-[min(58vh,560px)] sm:min-h-[430px]">
                    <img
                        className="absolute inset-0 h-full w-full object-cover"
                        src={optimizeImageUrl(getGridImage(0, featuredItem.fallbackImage), {
                            width: 920,
                            height: 1200,
                            fit: "crop",
                        })}
                        alt={featuredTitle}
                        loading="eager"
                        decoding="async"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.08)_0%,rgba(15,23,42,0.38)_48%,rgba(15,23,42,0.9)_100%)]" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-8">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/80">
                            Fresh Arrivals
                        </p>
                        <h2 className="mt-3 max-w-sm text-3xl font-black leading-tight sm:text-4xl">
                            {featuredTitle}
                        </h2>
                        <p className="mt-4 max-w-md text-sm leading-6 text-white/88 sm:text-base">
                            Swipe through bold edits built for quick discovery.
                        </p>
                        <div className="mt-6 flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => navigate("/products")}
                                className="rounded-full bg-teal-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-teal-500"
                            >
                                Shop
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate("/products")}
                                className="rounded-full border border-white/65 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                            >
                                Explore
                            </button>
                        </div>
                        <div className="mt-5 flex items-center gap-2" aria-hidden="true">
                            {gridLayout.map((item, index) => (
                                <span
                                    key={`${item.fallbackAlt}-dot`}
                                    className={`h-3 rounded-full ${
                                        index === 0 ? "w-8 bg-white" : "w-3 bg-white/45"
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="hidden gap-4 px-20 lg:grid lg:h-[600px] lg:grid-cols-12 lg:grid-rows-12">
                {gridLayout.map((item, index) => (
                    <div
                        key={item.fallbackAlt}
                        className={`${item.wrapperClassName} overflow-hidden rounded-[24px] border border-white/60 bg-white shadow-sm`}
                    >
                        <img
                            className="h-full w-full object-cover"
                            src={optimizeImageUrl(getGridImage(index, item.fallbackImage), item.imageOptions)}
                            alt={getGridName(index, item.fallbackAlt)}
                            loading="lazy"
                            decoding="async"
                        />
                    </div>
                ))}
            </div>
        </>
    )
}
export default Grid;
