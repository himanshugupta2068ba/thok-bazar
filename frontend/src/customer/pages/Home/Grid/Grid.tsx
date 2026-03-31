import { useAppSelector } from "../../../../Redux Toolkit/store";
import { selectGridHomeCategories } from "../../../../Redux Toolkit/featurs/coustomer/homeCategorySlice";
import { optimizeImageUrl } from "../../../../util/image";

const Grid=()=>{
    const gridItems = useAppSelector(selectGridHomeCategories);

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

    return(
        <div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:h-[600px] lg:grid-cols-12 lg:grid-rows-12 lg:px-20">
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
    )
}
export default Grid;
