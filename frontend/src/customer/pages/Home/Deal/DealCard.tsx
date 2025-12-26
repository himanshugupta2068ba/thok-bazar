import React from 'react'

export const DealCard=({deal}:any)=>{
    return(
        <div className='w-full cursor-pointer'>
            <img className='border-x-[7px] border-t-[7px]  w-full h-[12rem] object-cover object-top' src={deal.image} alt=''/>
            <div className='border-4 border-black bg-black text-white p-2 text-center'>
               <p className='text-2xl font-bold'>{deal.discount}%</p>
               <p className='font-bold'>shop now</p>
            </div>
        </div>
    )
}

