import { FormControl, InputLabel, MenuItem, Select } from "@mui/material"
import { FilterSection } from "./FilterSection"


export const Products=()=>{
    return(
        <div className="-z-10 mt-10">
            <div className="">
                <h1 className="text-3xl text-center font-bold text-gray-7-- pb-5 px-9 uppercase space-x-2">Women Saree</h1>
                <div className="border-r hidden lg:block w-[20%] min-h-screen border-gray-300">

                    <section>
                        <FilterSection/>
                    </section>

                    <section className="w-full lg:w-[80%] space-y-5">

                        <div className=""></div>

                        <FormControl fullWidth>
                            <InputLabel></InputLabel>
                            <Select>
                                <MenuItem></MenuItem>
                            </Select>

                        </FormControl>

                    </section>
                </div>
            </div>
        </div>
    )
}