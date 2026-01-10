import { useEffect, useState } from "react";
import "./ProductCard.css"

export const ProductCard = ({item}:any) => {

    const [ishovered,setIshovered]=useState(false);
    const [currentImage,setCurrentImage]=useState(0);

    useEffect(()=>{
        let interval:any;
        if(ishovered){
            interval=setInterval(()=>{
                setCurrentImage((prevImage)=>{
                    if(prevImage===item.images.length-1){
                        return 0;
                    }else{
                        return prevImage+1;
                    }
                })
            },1000)
        }else{
            setCurrentImage(0);
            clearInterval(interval);

        }
    },[ishovered]);

// useEffect(() => {
//   if (!ishovered) {
//     setCurrentImage(0);
//     return;
//   }

//   const interval = setInterval(() => {
//     setCurrentImage((prev) =>
//       prev === item.images.length - 1 ? 0 : prev + 1
//     );
//   }, 1000);

//   return () => clearInterval(interval);
// }, [ishovered, item.images.length]);


    return (
        <div className="group px-4 relative">
           <div className="relative w-[250px] sm:w-full h-[350px] overflow-hidden" onMouseEnter={()=>setIshovered(true)} onMouseLeave={()=>setIshovered(false)}>

            {/* {item.images.map((image:string,index:number)=>
            <img src={image} key={index} className="card-media object-top" style={{transform:`translateX(${(index-currentImage)*100}%)`,}} />
            )} */}

 {item.images.map((image: string, index: number) => (
  <img
    key={index}
    src={image}
    className="card-media object-top"
    style={{
      transform: `translateX(${(index - currentImage) * 100}%)`,
    }}
  />
))}


           </div>
        </div>
    )
}