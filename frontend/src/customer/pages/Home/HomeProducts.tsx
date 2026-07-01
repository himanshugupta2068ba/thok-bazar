import { useEffect, useMemo } from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router";
import { getAllProducts } from "../../../Redux Toolkit/featurs/coustomer/productSlice";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/store";
import { ProductCard } from "../Product/ProductCard";
import { RouteLoader } from "../../../common/RouteLoader";

const HomeProducts = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const product = useAppSelector((state) => state.product);
    const productItems = useMemo(() => product.products || [], [product.products]);

    useEffect(() => {
        const request = dispatch(
            getAllProducts({
                sort: "newest",
                pageNumber: 0,
            }),
        );

        return () => {
            request.abort();
        };
    }, [dispatch]);

    return (
        <section className="px-4 sm:px-6 lg:px-20">
            <div className="mx-auto max-w-375">
                <div className="flex flex-col gap-4 pb-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-teal-700 sm:text-left">
                            Product Picks
                        </p>
                        <h2 className="mt-2 text-center text-2xl font-black text-slate-950 sm:text-left sm:text-3xl">
                            Latest Products
                        </h2>
                    </div>
                    <Button
                        variant="outlined"
                        onClick={() => navigate("/products")}
                        className="self-center sm:self-auto"
                        sx={{
                            borderRadius: "999px",
                            px: 2.5,
                            textTransform: "none",
                            fontWeight: 700,
                        }}
                    >
                        View All
                    </Button>
                </div>

                {product.loading && !productItems.length ? (
                    <RouteLoader label="Loading products..." />
                ) : (
                    <div className="grid grid-cols-1 justify-items-center gap-x-4 gap-y-6 min-[520px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                        {productItems.slice(0, 8).map((item: any, index: number) => (
                            <div key={item._id || item.id || index} className="w-full max-w-[340px]">
                                <ProductCard item={item} />
                            </div>
                        ))}
                    </div>
                )}

                {!product.loading && !productItems.length ? (
                    <div className="rounded-[28px] border border-dashed border-slate-300 bg-white/80 px-5 py-12 text-center text-sm text-slate-500">
                        Products will appear here once they are listed.
                    </div>
                ) : null}
            </div>
        </section>
    );
};

export default HomeProducts;
