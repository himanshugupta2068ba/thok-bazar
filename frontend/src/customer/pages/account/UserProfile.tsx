import { useAppSelector } from "../../../Redux Toolkit/store";
import { ProfileFieldCart } from "./ProfileFieldCart"


export const UserProfile=()=>{
 const {auth}=useAppSelector((state: any)=>state);
 return(
    <div>
        <ProfileFieldCart keys="Name" value={auth.user?.fullName || auth.user?.name || "N/A"}/>
        <ProfileFieldCart keys="Email" value={auth.user?.email || "N/A"}/>
        <ProfileFieldCart keys="Phone" value={auth.user?.mobile || "N/A"}/>
        <ProfileFieldCart keys="Password" value="********"/>
    </div>
 )
}