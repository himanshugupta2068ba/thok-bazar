import {
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
} from "@mui/material";
import { FilterSection } from "./FilterSection";
import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "./ProductCard";
import { useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/store";
import { getAllProducts } from "../../../Redux Toolkit/featurs/coustomer/productSlice";
import {
  priceFilterOptions,
  resolveMainCategoryId,
} from "../../../data/product/productConfig";

export const Products = () => {
  const dispatch = useAppDispatch();
  const { categoryId } = useParams();
  const { product } = useAppSelector((state) => state);
  const [sort, setSort] = useState("price_low");
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const mainCategoryId = useMemo(
    () => resolveMainCategoryId(categoryId),
    [categoryId],
  );

  const handlesortProduct = (e: any) => {
    setSort(e.target.value);
    setPage(1);
  };

  useEffect(() => {
    setPage(1);
    setFilters({});
  }, [categoryId]);

  const queryParams = useMemo(() => {
    const nextParams: Record<string, string | number> = {
      category: categoryId || "",
      sort,
      pageNumber: page - 1,
    };

    const selectedPriceRange = priceFilterOptions.find(
      (item) => item.value === filters.priceRange,
    );

    if (selectedPriceRange) {
      nextParams.minPrice = selectedPriceRange.min;
      nextParams.maxPrice = Number.isFinite(selectedPriceRange.max)
        ? selectedPriceRange.max
        : 9999999;
    }

    if (filters.minDiscount) {
      nextParams.minDiscount = filters.minDiscount;
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (!value || key === "priceRange" || key === "minDiscount") {
        return;
      }

      if (key === "color" || key === "size") {
        nextParams[key] = value;
        return;
      }

      nextParams[`spec_${key}`] = value;
    });

    return nextParams;
  }, [categoryId, filters, page, sort]);

  useEffect(() => {
    if (!categoryId) return;

    dispatch(getAllProducts(queryParams));
  }, [dispatch, categoryId, queryParams]);

  const title = useMemo(() => {
    if (!categoryId) return "Products";
    return categoryId.replace(/[-_]/g, " ");
  }, [categoryId]);

  const productItems = useMemo(() => product.products || [], [product.products]);

  const handleFilterChange = (key: string, value: string) => {
    setPage(1);
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleClearFilters = () => {
    setPage(1);
    setFilters({});
  };

  return (
    <div className="-z-10 mt-10">
      <div className="">
        <h1 className="text-3xl text-center font-bold text-gray-700 pb-5 px-9 uppercase space-x-2">
          {title}
        </h1>
      </div>

      <div className="lg:flex">
        <section className="hidden lg:block w-[20%] min-h-screen border-gray-300">
          <FilterSection
            mainCategoryId={mainCategoryId}
            filters={filters}
            onFilterChange={handleFilterChange}
            onClear={handleClearFilters}
          />
        </section>

        <section className="w-full lg:w-[80%] space-y-5">
          <div className="flex justify-between items-center px-9 h-10">
            <div className="text-sm text-gray-500">
              {product.totalElements || 0} item(s) found
            </div>

            <FormControl>
              <InputLabel id="demo-simple-select-label">Sort</InputLabel>
              <Select
                labelId="sort"
                id="sort"
                value={sort}
                label="Sort"
                onChange={handlesortProduct}
              >
                <MenuItem value={"price_low"}>Price:Low-High</MenuItem>
                <MenuItem value={"price_high"}>Price:High-Low</MenuItem>
                <MenuItem value={"newest"}>Newest</MenuItem>
              </Select>
            </FormControl>
          </div>

          <Divider />

          <div className="grid sm:grid-cols-2 md:grid-cols3 lg:grid-cols-4 gap-y-5 px-5 justify-center mt-5">
            {productItems.map((item: any, index: number) => (
              <div key={item._id || index} className="flex justify-center">
                <ProductCard item={item} />
              </div>
            ))}
          </div>

          {!product.loading && !productItems.length ? (
            <div className="px-5 py-12 text-center text-gray-500">
              No products match the current category and filters.
            </div>
          ) : null}

          <div className="flex justify-center mt-5">
            <Pagination
              count={Math.max(1, product.totalPages || 1)}
              page={page}
              onChange={(_e, value) => setPage(value)}
              variant="outlined"
            />
          </div>
        </section>
      </div>
    </div>
  );
};
