export const DealCard=({deal}:any)=>{
    return(
        <div className='group w-full cursor-pointer px-2'>
            <img className='border-x-[7px] border-t-[7px]  w-full h-48 object-cover object-top transition-transform duration-500 group-hover:scale-[0.98]' src={deal.image} alt={deal.name}/>
            <div className='border-4 border-black bg-black text-white p-2 text-center transition-colors duration-300 group-hover:bg-teal-600 group-hover:border-teal-600'>
               <p className='text-lg font-bold'>{deal.name}</p>
               {deal.discount ? <p className='text-sm font-semibold'>{deal.discount}% OFF</p> : null}
               <p className='font-bold'>shop now</p>
            </div>
        </div>
    )
}

