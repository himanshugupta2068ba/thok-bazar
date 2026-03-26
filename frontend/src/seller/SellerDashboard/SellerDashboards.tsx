import { Navbar } from "../../common/Navbar"
import { SellerRoutes } from "../../routes/SellerRoutes"
import { SellerDrawwerList } from "../sidebar/SelllerDrawwerList"
import { SoftPageBackground } from "../../common/SoftPageBackground"



export const SellerDashboard=()=>{
    return(
        <div className="min-h-screen">
            <Navbar DrawerList={SellerDrawwerList}/>
            <section className="lg:flex lg:h-24vh">
                <div className="hidden lg:block h-full">
                    <SellerDrawwerList/>
                </div>
                <div className="w-full lg:w-[80%] overflow-y-auto">
                    <SoftPageBackground className="min-h-full">
                        <div className="p-10">
                            <SellerRoutes/>
                        </div>
                    </SoftPageBackground>
                </div>
            </section>

            
        </div>
    )
}
