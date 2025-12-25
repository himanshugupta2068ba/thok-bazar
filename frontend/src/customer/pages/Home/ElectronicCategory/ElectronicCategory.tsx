import React from "react";
import ElectronicCategoryCard from "./ElectronicCard";

const electronics=[
    {
    section:"ELECTRIC_CATEGORY",
    name:"Laptop",
    image:"https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bGFwdG9wfGVufDB8fDB8fHww",
    categoryId:'laptop'
    },
    {
    section:"ELECTRIC_CATEGORY",
    name:"Mobile",
    image:"https://images.unsplash.com/photo-1596558450268-9c27524ba856?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTB8fG1vYmlsZXxlbnwwfHwwfHx8MA%3D%3D",
    categoryId:'mobile'
    },
    {
    section:"ELECTRIC_CATEGORY",
    name:"Headphone",
    image:"https://plus.unsplash.com/premium_photo-1679513691474-73102089c117?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aGVhZHBob25lc3xlbnwwfHwwfHx8MA%3D%3D",
    categoryId:'headphone'
   },
   {
    section:"ELECTRIC_CATEGORY",
    name:"Camera",
    image:"https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2FtZXJhfGVufDB8fDB8fHww",
    categoryId:'camera'
   },
   {
    section:"ELECTRIC_CATEGORY",
    name:"Smart Watch",
    image:"https://images.unsplash.com/photo-1461141346587-763ab02bced9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8c21hcnQlMjB3YXRjaHxlbnwwfHwwfHx8MA%3D%3D",
    categoryId:'smart_watch'
   },
   {
    section:"ELECTRIC_CATEGORY",
    name:"Tablet",
    image:"https://images.unsplash.com/photo-1623126908029-58cb08a2b272?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dGFibGV0fGVufDB8fDB8fHww",
    categoryId:'tablet'
   },
   {
    section:"ELECTRIC_CATEGORY",
    name:"Tv",
    image:"https://images.unsplash.com/photo-1615210230840-69c07c13b4d1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTZ8fFR2fGVufDB8fDB8fHww",
    categoryId:'tv'
   }
]

const ElectronicCategory = () => {
    return(
       <div className="flex flex-wrap justify-between py-5 lg:px-20 border-b">
        {electronics.map((item)=><ElectronicCategoryCard ListItem={item}/>)}
       </div>
    )
}

export default ElectronicCategory;