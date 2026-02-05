import { useEffect, useState } from "react";
import "./ProductCard.css";
import { useNavigate } from "react-router";

export const ProductCard = ({ item }: any) => {
  const [currentImage, setCurrentImage] = useState(0);

  const [ishovered, setIshovered] = useState(false);

 const navigate=useNavigate();

  useEffect(() => {
    let interval: any;
    if (ishovered) {
      interval = setInterval(
        () => setCurrentImage((prev) => (prev + 1) % item.images.length),
        1000
      );
    } else if (interval) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [ishovered, item.images.length]);

  return (
    <div onClick={()=>navigate(`/product-details/${item.categoryId || 1}/${item.name || "man shirt"}/${item.productId || 123}`)} className="group px-4 relative">
      <div
        className="relative w-62.5 sm:w-full h-87.5 overflow-hidden"
        onMouseEnter={() => setIshovered(true)}
        onMouseLeave={() => setIshovered(false)}
      >
        {item.images.map((image: string, index: number) => (
          <img
            src={image}
            key={index}
            className="card-media object-top"
            style={{
              transform: `translateX(${(index - currentImage) * 100}%)`,
            }}
          />
        ))}
      </div>

      <div className="details pt-3 space-y-1 group-hover-effect rounded-md">
        <div className="name space-y">
          <h1 className="font-semibold text-lg">
            {item.seller?.bussinessDetails?.bussinessName}
          </h1>
          <p>Marron Floral Patteren Saree</p>
        </div>
        <div className="price flex items-center gap-3">
          <span className="font-semibold text-teal-800"> ₹2999 </span>
          <span className="line-through text-gray-500 text-sm-blur">
            {" "}
            ₹3999{" "}
          </span>
          <span className="text-green-600 text-sm"> 25% off </span>
        </div>
      </div>
    </div>
  );
};
