import { Divider } from "@mui/material"

export const ProfileFieldCart=({keys,value}:any)=>{
    return(
        <div className="p-5 flex items-center bg-slate-50">
            <p className="w-20 lg:w-36 pr-5">{keys}</p>
            <Divider orientation="vertical" flexItem />
            <p className="font-medium">{value}</p>
        </div>
    )
}