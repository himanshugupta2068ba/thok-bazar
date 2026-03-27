import { useAppSelector } from "../../../../Redux Toolkit/store";
import { selectGridHomeCategories } from "../../../../Redux Toolkit/featurs/coustomer/homeCategorySlice";
import { optimizeImageUrl } from "../../../../util/image";

const Grid=()=>{
    const gridItems = useAppSelector(selectGridHomeCategories);

    const getGridImage = (index: number, fallback: string) =>
        gridItems[index]?.image || fallback;

    const getGridName = (index: number, fallback: string) =>
        gridItems[index]?.name || fallback;

    return(
        <div className="grid gap-4 grid-rows-12 grid-cols-12 lg:h-[600px] px-5 lg:px-20">

            <div className="col-span-3 row-span-12 text-white rounded-md">
                <img className="w-full h-full object-cover rounded-md" src={optimizeImageUrl(getGridImage(0, "https://plus.unsplash.com/premium_photo-1682090778813-3938ba76ee57?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW5kaWFuJTIwZ3Jvb218ZW58MHx8MHx8fDA%3D"), { width: 720, height: 1200, fit: "crop" })} alt={getGridName(0, "Grid item 1")} loading="lazy" decoding="async"/>
            </div>

            <div className="col-span-2 row-span-6 text-white rounded-md">
                <img className="w-full h-full object-cover rounded-md" src={optimizeImageUrl(getGridImage(1, "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YWNjZXNzb3J5fGVufDB8fDB8fHww"), { width: 560, height: 560, fit: "crop" })} alt={getGridName(1, "Grid item 2")} loading="lazy" decoding="async"/>
            </div>

            <div className="col-span-4 row-span-6 text-white rounded-md">
                <img className="w-full h-full object-cover rounded-md" src={optimizeImageUrl(getGridImage(2, "https://images.unsplash.com/photo-1732382642348-e0390efde4ff?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDZ8fGluZGlhbiUyMHdvbWFuJTIwd2l0aCUyMGpld2VsbGVyeXxlbnwwfHwwfHx8MA%3D%3D"), { width: 900, height: 560, fit: "crop" })} alt={getGridName(2, "Grid item 3")} loading="lazy" decoding="async"/>
            </div>

            <div className="col-span-3 row-span-12 text-white rounded-md">
                <img className="w-full h-full object-cover rounded-md" src={optimizeImageUrl(getGridImage(3, "https://images.unsplash.com/photo-1610047520958-b42ebcd2f6cb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGluZGlhbiUyMGJyaWRlfGVufDB8fDB8fHww"), { width: 720, height: 1200, fit: "crop" })} alt={getGridName(3, "Grid item 4")} loading="lazy" decoding="async"/>
            </div>

            <div className="col-span-4 row-span-6 text-white rounded-md">
                <img className="w-full h-full object-cover rounded-md" src={optimizeImageUrl(getGridImage(4, "https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHNob2VzfGVufDB8fDB8fHww"), { width: 900, height: 560, fit: "crop" })} alt={getGridName(4, "Grid item 5")} loading="lazy" decoding="async"/>
            </div>

            <div className="col-span-2 row-span-6 text-white rounded-md">
                <img className="w-full h-full object-cover rounded-md" src={optimizeImageUrl(getGridImage(5, "https://images.unsplash.com/photo-1676951334972-2e65e67f4cbe?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTJ8fHBlcmZ1bWV8ZW58MHx8MHx8fDA%3D"), { width: 560, height: 560, fit: "crop" })} alt={getGridName(5, "Grid item 6")} loading="lazy" decoding="async"/>
            </div>
        </div>
    )
}
export default Grid;
