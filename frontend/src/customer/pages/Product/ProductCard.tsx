import { useEffect, useState } from "react";
import "./ProductCard.css";
import { useNavigate } from "react-router";

export const ProductCard = ({ item }: any) => {
  const [currentImage, setCurrentImage] = useState(0);

  const [ishovered, setIshovered] = useState(false);

 const navigate=useNavigate();

  const images = item?.images?.length ? item.images : ["https://images.unsplash.com/photo-1580854898508-4761a9c769a9?w=600&auto=format&fit=crop&q=60"];
  const categoryId = item?.category?.categoryId || item?.categoryId || "default";
  const productId = item?._id || item?.productId || item?.id;
  const productName = item?.title || item?.name || "product";

  const sellerName =
    item?.sellerId?.businessDetails?.businessName ||
    item?.sellerId?.sellerName ||
    item?.seller?.businessDetails?.businessName ||
    item?.seller?.bussinessDetails?.bussinessName ||
    "Seller";

  const sellingPrice = item?.sellingPrice ?? 2999;
  const mrpPrice = item?.mrpPrice ?? 3999;
  const discount =
    item?.discountPercentage ??
    (mrpPrice > 0 ? Math.round(((mrpPrice - sellingPrice) / mrpPrice) * 100) : 0);

  useEffect(() => {
    let interval: any;
    if (ishovered) {
      interval = setInterval(
        () => setCurrentImage((prev) => (prev + 1) % images.length),
        1000
      );
    } else if (interval) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [ishovered, images.length]);

  return (
    <div onClick={()=>navigate(`/product-details/${categoryId}/${encodeURIComponent(productName)}/${productId}`)} className="group px-4 relative">
      <div
        className="relative w-62.5 sm:w-full h-87.5 overflow-hidden"
        onMouseEnter={() => setIshovered(true)}
        onMouseLeave={() => setIshovered(false)}
      >
        {images.map((image: string, index: number) => (
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
            {sellerName}
          </h1>
          <p>{productName}</p>
        </div>
        <div className="price flex items-center gap-3">
          <span className="font-semibold text-teal-800"> ₹{sellingPrice} </span>
          <span className="line-through text-gray-500 text-sm-blur">
            ₹{mrpPrice}
          </span>
          <span className="text-green-600 text-sm"> {discount}% off </span>
        </div>
      </div>
    </div>
  );
};
