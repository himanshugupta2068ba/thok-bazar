import { useNavigate } from 'react-router';

const ElectronicCategoryCard = ({ListItem}:any) => {
    const navigate=useNavigate();
    return(
         <div onClick={()=>navigate(`/products/${ListItem.categoryId}`)} className="group flex w-20 flex-col items-center gap-3 cursor-pointer mx-auto">
          <img className="object-contain h-10 w-20 transition-transform duration-300 group-hover:scale-110" src={ListItem.image} alt={ListItem.name} />
          <h2 className='font-semibold text-sm transition-colors duration-300 group-hover:text-teal-600'>{ListItem.name}</h2>
        </div>
    )
}
export default ElectronicCategoryCard;