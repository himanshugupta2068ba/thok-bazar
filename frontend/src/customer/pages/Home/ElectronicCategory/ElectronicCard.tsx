import { useNavigate } from 'react-router';
import { optimizeImageUrl } from "../../../../util/image";

const ElectronicCategoryCard = ({ListItem}:any) => {
    const navigate=useNavigate();
    return(
         <button
            type="button"
            onClick={()=>navigate(`/products/${ListItem.categoryId}`)}
            className="flex w-full max-w-[120px] flex-col items-center gap-3 text-center"
         >
          <img
            className="h-10 w-20 object-contain"
            src={optimizeImageUrl(ListItem.image, { width: 160, height: 80, fit: "fill" })}
            alt={ListItem.name}
            loading="lazy"
            decoding="async"
          />
          <h2 className='text-sm font-medium text-slate-700'>{ListItem.name}</h2>
        </button>
    )
}
export default ElectronicCategoryCard;
