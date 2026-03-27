import ElectronicCategoryCard from "./ElectronicCard";
import { useAppSelector } from "../../../../Redux Toolkit/store";
import { selectElectronicHomeCategories } from "../../../../Redux Toolkit/featurs/coustomer/homeCategorySlice";

const ElectronicCategory = () => {
    const electronics = useAppSelector(selectElectronicHomeCategories);

    return(
    <section className="px-4 pt-5 sm:px-6 lg:px-20">
        <div className="rounded-[24px] border border-slate-200 bg-white px-4 py-5 shadow-sm sm:px-6">
            <div className="mb-6">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Popular Picks</p>
                    <h2 className="mt-1 text-lg font-semibold text-slate-900 sm:text-xl">Electronic Categories</h2>
                </div>
            </div>

            <div className="grid grid-cols-2 justify-items-center gap-x-6 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {electronics.map((item: any) => (
                    <ElectronicCategoryCard key={item._id || item.categoryId} ListItem={item}/>
                ))}
            </div>
        </div>
       </section>
    )
}

export default ElectronicCategory;
