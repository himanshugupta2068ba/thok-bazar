import { ElectricBolt } from "@mui/icons-material"
import { Avatar } from "@mui/material"

export const OrderItemCart=()=>{
    return(
        <div className="text-sm bg-white p-5 space-y-4 border border-gray-300 rounded-md cursor-pointer">
            <div className="flex items-center gap-3">
                <div>
                    <Avatar sizes="small" sx={{bgcolor:'#00927c'}}>
                    <ElectricBolt/>
                </Avatar>
                </div>
                <div>
                <h1 className="font-bold text-teal-600">Pending</h1>
                <p>Arriving by 12/2/2026</p>
            </div>
            </div>
            <div className="p-5 bg-teal-50 flex gap-3">
                <div className="" >
                    <img className='w-17.5' src="https://m.media-amazon.com/images/I/61jLi2nQJDL._SX679_.jpg" alt="product image"/>
                </div>
                <div className="w-full space-y-2">
                    <h1 className="font-bold">THok-baxzar</h1>
                    <p>Sare dfdjb is the best</p>
                    <p><strong>size :</strong>Free</p>
                </div>
            </div>
        </div>
    )
}