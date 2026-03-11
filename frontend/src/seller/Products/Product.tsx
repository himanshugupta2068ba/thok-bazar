import ProductTables from "./ProductTable"
import { useEffect } from "react";
import { fetchSellerProducts } from "../../Redux Toolkit/featurs/seller/sellerProductSlice";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";

export const Product = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.sellerProducts);
  const jwtToken = localStorage.getItem("sellerJwt");

  useEffect(()=>{
    if (!jwtToken) return;
    dispatch(fetchSellerProducts({ jwt: jwtToken, pageNumber: 0 }));
  }, [dispatch, jwtToken]);

  return (
    <>
        <h1 className="pb-5 text-2xl font-bold">ALL Products</h1>
        {loading && <p className="pb-4 text-sm text-gray-600">Loading products...</p>}
        {error && <p className="pb-4 text-sm text-red-600">{error}</p>}
        <ProductTables />
    </>
  )
}