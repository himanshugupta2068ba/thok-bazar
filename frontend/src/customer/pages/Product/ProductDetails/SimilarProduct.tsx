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

    const controller = new AbortController();
    setLoading(true);

    api
      .get(`/products/${productId}/similar`, {
        signal: controller.signal,
      })
      .then((response) => {
        setProducts(response.data || []);
      })
      .catch((error) => {
        if (error?.code === "ERR_CANCELED" || error?.name === "CanceledError") {
          return;
        }
        console.error("Failed to fetch similar products", error);
        setProducts([]);
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
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
