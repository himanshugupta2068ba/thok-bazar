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
  const formattedTitle = useMemo(
    () => title.replace(/\b\w/g, (char) => char.toUpperCase()),
    [title],
  );

  const productItems = useMemo(() => product.products || [], [product.products]);
  const activeFiltersCount = useMemo(
    () => Object.values(filters).filter(Boolean).length,
    [filters],
  );

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
    <div className="mt-6 px-4 pb-10 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-[1500px] rounded-[36px] border border-slate-200/80 bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.16),_transparent_30%),linear-gradient(135deg,_#f7fffd_0%,_#f8fafc_58%,_#ffffff_100%)] px-6 py-8 shadow-[0_22px_60px_rgba(15,23,42,0.08)] sm:px-8 lg:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-white/70 bg-white/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-teal-700 shadow-sm">
              Curated Collection
            </span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Explore {formattedTitle}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Modern picks, cleaner comparisons, and faster add-to-cart browsing
              for your {formattedTitle.toLowerCase()} collection.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[360px]">
            <div className="rounded-[24px] border border-white/70 bg-white/80 px-4 py-4 shadow-sm backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
                Products Found
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {product.totalElements || 0}
              </p>
            </div>
            <div className="rounded-[24px] border border-white/70 bg-white/80 px-4 py-4 shadow-sm backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
                Active Filters
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {activeFiltersCount}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto mt-8 flex max-w-[1500px] gap-6 lg:items-start">
        <section className="hidden w-[22%] lg:block">
          <div className="sticky top-24 rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
            <FilterSection
              mainCategoryId={mainCategoryId}
              filters={filters}
              onFilterChange={handleFilterChange}
              onClear={handleClearFilters}
            />
          </div>
        </section>

        <section className="w-full space-y-6 lg:w-[78%]">
          <div className="flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white/95 px-5 py-4 shadow-[0_14px_38px_rgba(15,23,42,0.06)] sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
                Browse
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Refine the list and sort products the way you shop.
              </p>
            </div>

            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel id="sort">Sort</InputLabel>
              <Select
                labelId="sort"
                id="sort"
                value={sort}
                label="Sort"
                onChange={handlesortProduct}
                sx={{ borderRadius: "999px", backgroundColor: "#f8fafc" }}
              >
                <MenuItem value={"price_low"}>Price: Low to High</MenuItem>
                <MenuItem value={"price_high"}>Price: High to Low</MenuItem>
                <MenuItem value={"newest"}>Newest</MenuItem>
              </Select>
            </FormControl>
          </div>

          <Divider />

          <div className="grid justify-center gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {productItems.map((item: any, index: number) => (
              <div key={item._id || index} className="flex justify-center">
                <ProductCard item={item} />
              </div>
            ))}
          </div>

          {!product.loading && !productItems.length ? (
            <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 px-5 py-12 text-center text-gray-500">
              No products match the current category and filters.
            </div>
          ) : null}

          <div className="mt-3 flex justify-center">
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
