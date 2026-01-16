import { Add, AddShoppingCart, LocalShipping, Remove, Shield, Star, Wallet, WorkspacePremium } from "@mui/icons-material";
import { Button, Divider } from "@mui/material";
import { useState } from "react";
import { SimilarProduct } from "./SimilarProduct";

const images = [
  "https://images.unsplash.com/photo-1580854898508-4761a9c769a9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8d29tZW4lMjBzYXJlZXxlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1756483482418-3f3e4c13f9b0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8d29tZW4lMjBzYXJlZXxlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1677002419193-9a74069587af?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHdvbWVuJTIwc2FyZWV8ZW58MHx8MHx8fDA%3D",
];

export const ProductDetails = () => {
  // const [cuurrentImage, setCurrentImage] = useState(images[0]);
  // const handelImageChange=(index:number)=>{
  //      setCurrentImage(images[index]);
  // }
  const [baseImage, setBaseImage] = useState(images[0]); // clicked image
  const [currentImage, setCurrentImage] = useState(images[0]); // shown image

  const handleHover = (index: number) => {
    setCurrentImage(images[index]);
  };

  const handleLeave = () => {
    setCurrentImage(baseImage);
  };

  const handleClick = (index: number) => {
    setBaseImage(images[index]);
    setCurrentImage(images[index]);
  };

  const [quantity, setQuantity] = useState(1);
  const handleQuantityChange = (type: "increment" | "decrement") => {
    if (type === "increment") {
      setQuantity((prev) => prev + 1);
    } else {
      setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    }
    };
  return (
    <div className="min-h-screen px-5 lg:px-20 pt-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <section className="flex flex-col lg:flex-row gap-5">
          <div className="w-full lg:w-[15%] flex flex-wrap lg:flex-col gap-3">
            {images.map((imgSrc, index) => (
              <img
                onMouseEnter={() => handleHover(index)}
                onMouseLeave={handleLeave}
                onClick={() => handleClick(index)}
                key={index}
                src={imgSrc}
                alt="product"
                className="lg:w-full w-12.5 cursor-pointer border-2 border-gray-300 rounded-md"
              />
            ))}
          </div>
          <div className="w-full lg:w-[85%]">
            <img
              src={currentImage}
              alt="current product"
              className="w-full  border-2 border-gray-300 rounded-md"
            />
          </div>
        </section>
        
        <section>
            <h1 className="font-bold text-lg text-teal-500">Zara Clothing</h1>
            <p className="text-gray-500 font-semibold">Marron Floral Patterned Saree</p>
        <div className="flex justify-between items-center py-2 border border-gray-300 w-45 px-3 mt-5">
            <div className="flex gap-1 items-center">
                <span>4</span>
                <Star className="text-yellow-500 ml-1"/>
            </div>
            <Divider orientation="vertical" flexItem />
            <div>
                <span className="font-semibold text-lg">1200 Reviews</span>
            </div>
           
        </div>
         <div className="space-y-2 pt-5">
                 <div className="price flex items-center gap-3">
          <span className="font-bold text-teal-800"> ₹2999 </span>
          <span className="line-through text-gray-500 text-sm-blur">
            {" "}
            ₹3999{" "}
          </span>
          <span className="text-green-600 text-sm"> 25% off </span>
        </div>
        <p>Inclusive of All Taxes</p>
            </div>
            <div className="mt-7 space-y-3">
                <div className="flex items-center gap-4">
                    <Shield color="primary"/>
                    <span className="ml-2">Authentic and Asured Quality</span>
                </div>
                <div className="flex items-center gap-4">
                    <WorkspacePremium color="primary"/>
                    <span className="ml-2">100% money back gaurantee</span>
                </div>
                <div className="flex items-center gap-4">
                    <LocalShipping color="primary"/>
                    <span className="ml-2">Free Shipping</span>
                </div>
                <div className="flex items-center gap-4">
                    <Wallet color="primary"/>
                    <span className="ml-2">Secure Payment</span>
                </div>
            </div>
            <div className="mt-7 space-y-2">
                <h1>Quantity</h1>
                <div className="flex items-center gap-5 w-35">
                    <Button 
                    variant="outlined" onClick={() => handleQuantityChange("decrement")}><Remove/></Button>   
                    <span>{quantity}</span>        
                    <Button variant="outlined" onClick={() => handleQuantityChange("increment")}><Add/></Button>
                         </div>
            </div>
            <div className="mt-12 flex items-center gap-5">
                <Button startIcon={<AddShoppingCart/>}
                variant="contained" color="primary" className="w-40 py-3 font-bold">Add to Cart</Button>
                <Button variant="outlined" color="primary" className="w-40 py-3 font-bold">Buy Now</Button>
            </div>
            <div className="mt-10">
                <p className="font-bold text-lg mb-3">Product Details</p>
                <p className="text-gray-600">This saree is made from high-quality fabric that ensures comfort and durability. The intricate floral patterns are designed to add a touch of elegance to your look, making it perfect for both casual and formal occasions. Whether you're attending a wedding or a festive celebration, this saree will make you stand out with its vibrant colors and exquisite design. Pair it with traditional jewelry and accessories to complete your ensemble.</p>
            </div>
        </section>
      </div>
      <section className="mt-20">
        <h1 className="text-lg font-bold">Similar Product</h1>
        <div className="pt-5">
            <SimilarProduct/>
        </div>
      </section>
    </div>
  );
};
