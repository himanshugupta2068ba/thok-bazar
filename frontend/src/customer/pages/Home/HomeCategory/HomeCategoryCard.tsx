

const HomeCategoryCard=()=>{
    return(
        <div className="flex gap-3 flex-col justify-center items-center group cursor-pointer">
            <div className="custom-border w-[150px] lg:w-[249px] h-[150px] lg:h=[249px] rounded-full bg-teal-400">
                <img className="group-hover:scale-95 transition-transform transform-duration-700 object-cover object-top h-full w-full rounded-full" src={"https://plus.unsplash.com/premium_photo-1676748933022-e1183e997436?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGVyZnVtZXxlbnwwfHwwfHx8MA%3D%3D"} alt=""/>
    
            </div>
            <h1 className="font-medium">Black Berry</h1>
        </div>
    )
}
export default HomeCategoryCard;