import { Navbar } from "../../common/Navbar"
import { AdminRoutes } from "../../routes/AdminRoutes"
import { AdminDrawwerList } from "../Sidebar/AdminDrawerList"
import { SoftPageBackground } from "../../common/SoftPageBackground"

export const Dashboard=()=>{
    return(
        <div className="min-h-screen">
            <Navbar DrawerList={AdminDrawwerList}/>
            <section className="lg:flex lg:h-90vh">
                <div className="hidden lg:block h-full">
                    <AdminDrawwerList/>
                </div>
                <div className="w-full lg:w-[80%] overflow-y-auto">
                    <SoftPageBackground className="min-h-full">
                        <div className="p-10">
                            <AdminRoutes/>
                        </div>
                    </SoftPageBackground>
                </div>
            </section>

        </div>
    )
}
