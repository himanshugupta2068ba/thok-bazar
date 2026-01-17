import { ProductCard } from "../ProductCard"
const product = {
  images: [
    "https://images.unsplash.com/photo-1580854898508-4761a9c769a9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8d29tZW4lMjBzYXJlZXxlbnwwfHwwfHx8MA%3D%3D",
    "https://images.unsplash.com/photo-1756483482418-3f3e4c13f9b0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8d29tZW4lMjBzYXJlZXxlbnwwfHwwfHx8MA%3D%3D",
    "https://images.unsplash.com/photo-1677002419193-9a74069587af?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHdvbWVuJTIwc2FyZWV8ZW58MHx8MHx8fDA%3D",
  ],
  seller: {
    bussinessDetails: {
      bussinessName: "Saree Shop",
    },
  },
};
export const SimilarProduct=()=>{
    return(
        <div className="grid lg:grid-cols-6 md:grid-cols-4 grid-cols-1
        justify-between gap-4 gap-y-8">
            {[1,1,1,1,1,1,,1,1,1,].map((item)=><ProductCard item={product}/>)}
        </div>
    )
}