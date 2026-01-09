import { Divider, FormControl, InputLabel, MenuItem, Select } from "@mui/material"
import { FilterSection } from "./FilterSection"
import { useState } from "react";
import { ProductCard } from "./ProductCard";


const products=
    {
        images:[
      "https://images.unsplash.com/photo-1580854898508-4761a9c769a9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8d29tZW4lMjBzYXJlZXxlbnwwfHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1756483482418-3f3e4c13f9b0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8d29tZW4lMjBzYXJlZXxlbnwwfHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1677002419193-9a74069587af?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHdvbWVuJTIwc2FyZWV8ZW58MHx8MHx8fDA%3D",
    ]
}


export const Products=()=>{

    const [sort,setSort]=useState('price_low');

    const handlesortProduct=(e:any)=>{
        setSort(e.target.value);
    }
    return(
        <div className="-z-10 mt-10">
            <div className="">
                <h1 className="text-3xl text-center font-bold text-gray-700 pb-5 px-9 uppercase space-x-2">Women Saree</h1>
                </div>

                <div className="lg:flex">


                    <section className="border-r hidden lg:block w-[20%] min-h-screen border-gray-300">
                        <FilterSection/>
                    </section>
                

                    <section className="w-full lg:w-[80%] space-y-5">

                        <div className="flex justify-between items-center px-9 h-[40px]">

                            <div>

                            </div>

                        <FormControl>
                            <InputLabel id="demo-simple-select-label">Sort</InputLabel>
                            <Select
                            labelId="sort"
                            id="sort"
                            value={sort}
                            label="Sort"
                            onChange={handlesortProduct}
                                >
                                    <MenuItem value={"price_low"}>Price:Low-High</MenuItem>
                                    <MenuItem value={"price_high"}>Price:High-Low</MenuItem>
                                    <MenuItem value={"newest"}>Newest</MenuItem>
                            </Select>

                        </FormControl>

                       </div>
                  
                         <Divider/>

                         <div className="grid sm:grid-cols-2 md:grid-cols3 lg:grid-cols-4 gap-y-5 px-5 justify-center">
                            {[1,1,1,1,1,1,1,1,1,1,1,1].map((item,index)=>
                            <div key={index} className="flex justify-center">
                                <ProductCard item={products} />
                            </div>

                            )}

                         </div>
                    </section>
                </div>
            </div>
        // </div>
    )
}