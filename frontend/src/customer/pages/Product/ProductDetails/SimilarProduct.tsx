import { useEffect, useState } from "react";
import { api } from "../../../../config/api";
import { ProductCard } from "../ProductCard";

type SimilarProductProps = {
  productId?: string;
};

export const SimilarProduct = ({ productId }: SimilarProductProps) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!productId) return;

    setLoading(true);

    api
      .get(`/products/${productId}/similar`)
      .then((response) => {
        setProducts(response.data || []);
      })
      .catch((error) => {
        console.error("Failed to fetch similar products", error);
        setProducts([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [productId]);

  if (loading) {
    return <p className="text-sm text-gray-500">Loading similar products...</p>;
  }

  if (!products.length) {
    return <p className="text-sm text-gray-500">No similar products found right now.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((item) => (
        <ProductCard key={item._id || item.id} item={item} />
      ))}
    </div>
  );
};
