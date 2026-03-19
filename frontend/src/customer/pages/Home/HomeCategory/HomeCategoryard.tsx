import HomeCategoryCard from "./HomeCategoryCard"
import { useAppSelector } from "../../../../Redux Toolkit/store"


const HomeCategory=()=>{
    const items = useAppSelector((state) =>
        state.homeCategory.homeCategories.filter(
            (item: any) => item.section === "SHOP_BY_CATEGORY",
        ),
    );

    return(
        <div className="flex justify-center gap-7 flex-wrap">
            {items.slice(0, 8).map((item: any) => <HomeCategoryCard key={item._id || item.categoryId} item={item}/>)}
        </div>
    )
}
export default HomeCategory;