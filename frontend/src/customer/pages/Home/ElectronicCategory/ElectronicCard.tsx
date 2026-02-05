import React from 'react';
import { useNavigate } from 'react-router';

const ElectronicCategoryCard = ({ListItem}:any) => {
    const navigate=useNavigate();
    return(
         <div onClick={()=>navigate(`/products/${ListItem.categoryId}`)} className="flex w-20 flex-col items-center gap-3 cursor-pointer">
          <img className="object-contain h-10 w-20" src={ListItem.image} alt={ListItem.name} />
          <h2 className='font-semibold text-sm'>{ListItem.name}</h2>
        </div>
    )
}
export default ElectronicCategoryCard;