import { useEffect, useMemo, useState } from "react";
import { Alert, CircularProgress, TextField, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { api } from "../../config/api";
import mainCategory from "../../data/category/mainCategory";
import { fetchSeller } from "../../Redux Toolkit/featurs/seller/sellerSlice";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const monthKey = (date: Date) => `${date.getFullYear()}-${date.getMonth()}`;

const parseDate = (value: any) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const toDateInputValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const startOfDay = (date: Date) => {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

const endOfDay = (date: Date) => {
  const copy = new Date(date);
  copy.setHours(23, 59, 59, 999);
  return copy;
};

export const AdminOverview = () => {
  const dispatch = useAppDispatch();
  const { sellers, loading: sellerLoading, error: sellerError } = useAppSelector((state) => state.sellerData);
  const today = useMemo(() => new Date(), []);
  const defaultStartDate = useMemo(() => {
    const date = new Date(today);
    date.setDate(today.getDate() - 29);
    return date;
  }, [today]);

  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [startDate, setStartDate] = useState(toDateInputValue(defaultStartDate));
  const [endDate, setEndDate] = useState(toDateInputValue(today));

  useEffect(() => {
    dispatch(fetchSeller(null));
  }, [dispatch]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setOrdersLoading(true);
        setOrdersError(null);
        const adminToken = localStorage.getItem("adminToken") || "";
        const response = await api.get("/admin/orders", {
          headers: adminToken
            ? {
                Authorization: `Bearer ${adminToken}`,
              }
            : undefined,
        });
        setOrders(response.data?.orders || []);
      } catch (error: any) {
        setOrdersError(
          error?.response?.data?.message ||
            error?.response?.data?.error ||
            error?.message ||
            "Failed to fetch platform orders",
        );
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const sellerLifecycleByMonth = useMemo(() => {
    const now = new Date();
    const months = Array.from({ length: 12 }).map((_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (11 - index), 1);
      return {
        key: monthKey(date),
        label: `${MONTH_NAMES[date.getMonth()]} ${String(date.getFullYear()).slice(-2)}`,
        newSellers: 0,
        deletedSellers: 0,
      };
    });

    const monthMap = new Map(months.map((entry) => [entry.key, entry]));

    (Array.isArray(sellers) ? sellers : []).forEach((seller: any) => {
      const createdAt = parseDate(seller?.createdAt);
      if (createdAt) {
        const createdBucket = monthMap.get(monthKey(createdAt));
        if (createdBucket) {
          createdBucket.newSellers += 1;
        }
      }

      const isDeleted = String(seller?.accountStatus || "").toUpperCase() === "CLOSED";
      const statusUpdatedAt = parseDate(seller?.updatedAt);

      if (isDeleted && statusUpdatedAt) {
        const deletedBucket = monthMap.get(monthKey(statusUpdatedAt));
        if (deletedBucket) {
          deletedBucket.deletedSellers += 1;
        }
      }
    });

    return months;
  }, [sellers]);

  const categoryFilterOptions = useMemo(
    () => [
      { id: "ALL", name: "All" },
      ...mainCategory.map((category: any) => ({ id: category.categoryid, name: category.name })),
    ],
    [],
  );

  const parsedStartDate = useMemo(() => {
    const parsed = new Date(startDate);
    return Number.isNaN(parsed.getTime()) ? null : startOfDay(parsed);
  }, [startDate]);

  const parsedEndDate = useMemo(() => {
    const parsed = new Date(endDate);
    return Number.isNaN(parsed.getTime()) ? null : endOfDay(parsed);
  }, [endDate]);

  const isDateRangeValid = Boolean(
    parsedStartDate && parsedEndDate && parsedStartDate.getTime() <= parsedEndDate.getTime(),
  );

  const dailySalesData = useMemo(() => {
    if (!parsedStartDate || !parsedEndDate || parsedStartDate.getTime() > parsedEndDate.getTime()) {
      return [];
    }

    const days: Array<{ key: string; label: string; sales: number }> = [];
    const cursor = new Date(parsedStartDate);

    while (cursor.getTime() <= parsedEndDate.getTime()) {
      days.push({
        key: cursor.toISOString().slice(0, 10),
        label: `${cursor.getDate()} ${MONTH_NAMES[cursor.getMonth()]}`,
        sales: 0,
      });
      cursor.setDate(cursor.getDate() + 1);
    }

    const dayMap = new Map(days.map((entry) => [entry.key, entry]));

    (Array.isArray(orders) ? orders : []).forEach((order: any) => {
      if (String(order?.orderStatus || "").toUpperCase() === "CANCELLED") {
        return;
      }

      const orderDate = parseDate(order?.createdAt || order?.orderDate);
      if (!orderDate) return;

      if (orderDate.getTime() < parsedStartDate.getTime() || orderDate.getTime() > parsedEndDate.getTime()) {
        return;
      }

      const key = new Date(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate())
        .toISOString()
        .slice(0, 10);
      const bucket = dayMap.get(key);
      if (!bucket) return;

      const orderItems = Array.isArray(order?.orderItems) ? order.orderItems : [];

      orderItems.forEach((item: any) => {
        const product = item?.product || {};
        const quantity = Number(item?.quantity || 0);
        const sellingPrice = Number(item?.sellingPrice || 0);
        const category = String(product?.mainCategory || "").trim().toLowerCase();

        if (selectedCategory !== "ALL" && category !== selectedCategory.toLowerCase()) {
          return;
        }

        bucket.sales += sellingPrice * quantity;
      });
    });

    return days;
  }, [orders, parsedEndDate, parsedStartDate, selectedCategory]);

  const salesMax = Math.max(...dailySalesData.map((item) => item.sales), 1);
  const lifecycleMax = Math.max(
    ...sellerLifecycleByMonth.map((item) => Math.max(item.newSellers, item.deletedSellers)),
    1,
  );

  const totalNewSellers = sellerLifecycleByMonth.reduce((sum, row) => sum + row.newSellers, 0);
  const totalDeletedSellers = sellerLifecycleByMonth.reduce((sum, row) => sum + row.deletedSellers, 0);
  const totalSales = dailySalesData.reduce((sum, day) => sum + day.sales, 0);

  const loading = sellerLoading || ordersLoading;
  const hasError = sellerError || ordersError;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-sm text-slate-600">
          Platform seller lifecycle and daily sales analytics with category filter.
        </p>
      </div>

      {hasError && <Alert severity="error">{sellerError || ordersError}</Alert>}

      {loading && !orders.length && !(Array.isArray(sellers) ? sellers.length : 0) ? (
        <div className="flex justify-center py-12">
          <CircularProgress />
        </div>
      ) : (
        <>
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs text-slate-500">New Sellers (12 months)</p>
              <h2 className="mt-2 text-2xl font-bold text-emerald-600">{totalNewSellers}</h2>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs text-slate-500">Deleted Accounts (12 months)</p>
              <h2 className="mt-2 text-2xl font-bold text-rose-600">{totalDeletedSellers}</h2>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs text-slate-500">Total Sales (Selected Date Range)</p>
              <h2 className="mt-2 text-2xl font-bold text-teal-700">Rs. {totalSales.toFixed(2)}</h2>
            </div>
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="text-base font-semibold text-slate-900">
                Seller Registration vs Account Deletion (Monthly)
              </h3>
              <p className="text-xs text-slate-500 mt-1">Last 12 months trend.</p>

              <div className="mt-5 h-64 w-full rounded-lg border border-slate-100 bg-slate-50 p-3">
                <div className="h-full w-full flex items-end gap-2 overflow-x-auto">
                  {sellerLifecycleByMonth.map((row) => {
                    const newHeight = `${Math.max((row.newSellers / lifecycleMax) * 100, row.newSellers > 0 ? 8 : 2)}%`;
                    const deletedHeight = `${Math.max((row.deletedSellers / lifecycleMax) * 100, row.deletedSellers > 0 ? 8 : 2)}%`;

                    return (
                      <div key={row.key} className="min-w-12 flex flex-col items-center gap-1">
                        <div className="h-48 w-full flex items-end justify-center gap-1">
                          <div className="w-3 rounded-t bg-emerald-500" style={{ height: newHeight }} title={`New: ${row.newSellers}`} />
                          <div className="w-3 rounded-t bg-rose-500" style={{ height: deletedHeight }} title={`Deleted: ${row.deletedSellers}`} />
                        </div>
                        <p className="text-[10px] text-slate-500 text-center">{row.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-3 flex items-center gap-4 text-xs text-slate-600">
                <div className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" />New Sellers</div>
                <div className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-full bg-rose-500" />Deleted Accounts</div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Platform Daily Sales</h3>
                  <p className="text-xs text-slate-500 mt-1">Daily sales by selected category and date range.</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <TextField
                  label="Start Date"
                  type="date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  fullWidth
                />
                <TextField
                  label="End Date"
                  type="date"
                  value={endDate}
                  onChange={(event) => setEndDate(event.target.value)}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  fullWidth
                />
              </div>

              {!isDateRangeValid && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  Please select a valid date range.
                </Alert>
              )}

              <div className="mt-4">
                <p className="text-xs font-semibold text-slate-600 mb-2">Category Filter (Main Categories)</p>
                <ToggleButtonGroup
                  size="small"
                  value={selectedCategory}
                  exclusive
                  onChange={(_, value) => {
                    if (value) setSelectedCategory(value);
                  }}
                >
                  {categoryFilterOptions.map((category) => (
                    <ToggleButton key={category.id} value={category.id}>
                      {category.name}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </div>

              <div className="mt-5 h-64 w-full rounded-lg border border-slate-100 bg-slate-50 p-3">
                {!isDateRangeValid ? (
                  <div className="h-full flex items-center justify-center text-sm text-slate-500">
                    Invalid date range.
                  </div>
                ) : !dailySalesData.some((item) => item.sales > 0) ? (
                  <div className="h-full flex items-center justify-center text-sm text-slate-500">
                    No sales data available for selected category.
                  </div>
                ) : (
                  <div className="h-full w-full flex items-end gap-1.5 overflow-x-auto">
                    {dailySalesData.map((item) => {
                      const height = `${Math.max((item.sales / salesMax) * 100, item.sales > 0 ? 6 : 1)}%`;
                      return (
                        <div key={item.key} className="flex flex-col items-center min-w-3">
                          <div
                            className="w-3 rounded-t bg-teal-500"
                            style={{ height }}
                            title={`${item.label}: Rs. ${item.sales.toFixed(2)}`}
                          />
                          <p className="text-[10px] text-slate-500 mt-1">{item.label.split(" ")[0]}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};
