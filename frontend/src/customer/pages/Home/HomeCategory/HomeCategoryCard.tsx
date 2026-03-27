import { useNavigate } from "react-router";
import { optimizeImageUrl } from "../../../../util/image";

const HomeCategoryCard=({ item }: any)=>{
    const navigate = useNavigate();

    return(
        <div onClick={() => navigate(`/products/${item.categoryId}`)} className="flex gap-3 flex-col justify-center items-center group cursor-pointer">
            <div className="custom-border w-[150px] lg:w-[249px] h-[150px] lg:h-[249px] rounded-full bg-teal-400 overflow-hidden">
                <img
                    className="group-hover:scale-95 transition-transform duration-700 object-cover object-top h-full w-full rounded-full"
                    src={optimizeImageUrl(item.image, { width: 498, height: 498, fit: "crop" })}
                    alt={item.name}
                    loading="lazy"
                    decoding="async"
                />
    
            </div>
            <h1 className="font-medium transition-colors duration-300 group-hover:text-teal-600">{item.name}</h1>
        </div>
    )
}
export default HomeCategoryCard;
