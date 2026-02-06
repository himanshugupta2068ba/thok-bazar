import { Navbar } from "../../common/Navbar"
import { SellerRoutes } from "../../routes/SellerRoutes"
import { SellerDrawwerList } from "../sidebar/SelllerDrawwerList"



export const SellerDashboard=()=>{
    return(
        <div className="min-h-screen">
            <Navbar DrawerList={SellerDrawwerList}/>
            <section className="lg:flex lg:h-24vh">
                <div className="hidden lg:block h-full">
                    <SellerDrawwerList/>
                </div>
                <div className="p-10 w-full lg:w-[80%] overflow-y-auto">
            <SellerRoutes/>
            </div>
            </section>

            
        </div>
    )
}