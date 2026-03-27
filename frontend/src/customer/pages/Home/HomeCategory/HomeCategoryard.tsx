import HomeCategoryCard from "./HomeCategoryCard"
import { useAppSelector } from "../../../../Redux Toolkit/store"
import { selectShopByCategoryHomeCategories } from "../../../../Redux Toolkit/featurs/coustomer/homeCategorySlice";


const HomeCategory=()=>{
    const items = useAppSelector(selectShopByCategoryHomeCategories);

    return(
        <div className="flex justify-center gap-7 flex-wrap">
            {items.slice(0, 8).map((item: any) => <HomeCategoryCard key={item._id || item.categoryId} item={item}/>)}
        </div>
    )
}
export default HomeCategory;
