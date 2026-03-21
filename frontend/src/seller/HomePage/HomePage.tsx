import { useEffect, useMemo, useState } from "react";
import { Alert, Chip, CircularProgress } from "@mui/material";
import { fetchSellerOrders } from "../../Redux Toolkit/featurs/seller/sellerOrderSlice";
import { fetchSellerProducts } from "../../Redux Toolkit/featurs/seller/sellerProductSlice";
import { fetchSellerReports } from "../../Redux Toolkit/featurs/seller/sellerSlice";
import { fetchSellerTransactions } from "../../Redux Toolkit/featurs/seller/transactionSlice";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import {
    formatCurrency,
    getTransactionAmount,
    getTransactionStatus,
    isVisibleSellerOrder,
    isVisibleSellerTransaction,
} from "../shared/sellerViewUtils";

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const getMonthKey = (date: Date) => `${date.getFullYear()}-${date.getMonth()}`;

const getWeekStart = (dateInput: Date) => {
    const date = new Date(dateInput);
    const day = date.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    date.setDate(date.getDate() + diff);
    date.setHours(0, 0, 0, 0);
    return date;
};

const toDate = (value: any) => {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const TinyLineChart = ({ points }: { points: number[] }) => {
    const width = 460;
    const height = 150;
    const min = Math.min(...points, 0);
    const max = Math.max(...points, 1);
    const range = max - min || 1;

    const buildY = (value: number) => height - ((value - min) / range) * (height - 20) - 10;
    const stepX = points.length > 1 ? width / (points.length - 1) : width;

    const polylinePoints = points
        .map((point, index) => `${index * stepX},${buildY(point)}`)
        .join(" ");

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="h-36 w-full rounded-lg bg-slate-50 p-2">
            <polyline fill="none" stroke="#0f766e" strokeWidth="3" points={polylinePoints} />
            {points.map((point, index) => (
                <circle key={`${point}-${index}`} cx={index * stepX} cy={buildY(point)} r="3" fill="#0f766e" />
            ))}
        </svg>
    );
};

export const HomePage = () => {
    const dispatch = useAppDispatch();
    const sellerJwt = localStorage.getItem("sellerJwt") || "";

    const { orders, loading: orderLoading, error: orderError } = useAppSelector((state) => state.sellerOrders);
    const { products, loading: productLoading, error: productError } = useAppSelector((state) => state.sellerProducts);
    const {
        transactions,
        loading: transactionLoading,
        error: transactionError,
    } = useAppSelector((state) => state.sellerTransactions);
    const { reports, loading: reportLoading, error: reportError } = useAppSelector((state) => state.sellerData);

    useEffect(() => {
        if (!sellerJwt) return;

        dispatch(fetchSellerOrders(sellerJwt));
        dispatch(fetchSellerProducts({ jwt: sellerJwt, pageNumber: 0 }));
        dispatch(fetchSellerTransactions(sellerJwt));
        dispatch(fetchSellerReports(sellerJwt));
    }, [dispatch, sellerJwt]);

    const safeOrders = useMemo(
        () => (Array.isArray(orders) ? orders : []).filter(isVisibleSellerOrder),
        [orders],
    );
    const safeTransactions = useMemo(
        () => (Array.isArray(transactions) ? transactions : []).filter(isVisibleSellerTransaction),
        [transactions],
    );
    const safeProducts = Array.isArray(products) ? products : [];

    const cancelledOrders = safeOrders.filter((order: any) => order?.orderStatus === "CANCELLED");
    const deliveredOrders = safeOrders.filter((order: any) => order?.orderStatus === "DELIVERED");
    const activeProducts = safeProducts.filter((product: any) => Number(product?.stock || 0) > 0);

    const receivedTransactions = safeTransactions.filter(
        (transaction: any) => getTransactionStatus(transaction) === "RECEIVED",
    );

    const totalRevenue = receivedTransactions.reduce(
        (sum: number, transaction: any) => sum + getTransactionAmount(transaction),
        0,
    );

    const now = new Date();
    const [selectedYear, setSelectedYear] = useState(now.getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(now.getMonth());

    const totalOrders = safeOrders.length;
    const cancellationRate = totalOrders ? (cancelledOrders.length / totalOrders) * 100 : 0;

    const ordersByMonth = useMemo(() => {
        const now = new Date();
        const monthFrames = Array.from({ length: 6 }).map((_, index) => {
            const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
            return {
                key: getMonthKey(date),
                label: `${MONTH_NAMES[date.getMonth()]} ${String(date.getFullYear()).slice(-2)}`,
                received: 0,
                cancelled: 0,
            };
        });

        const monthMap = new Map(monthFrames.map((item) => [item.key, item]));

        safeOrders.forEach((order: any) => {
            const date = toDate(order?.createdAt || order?.updatedAt || order?.orderDate);
            if (!date) return;

            const key = getMonthKey(date);
            const bucket = monthMap.get(key);
            if (!bucket) return;

            if (order?.orderStatus === "CANCELLED") {
                bucket.cancelled += 1;
            } else {
                bucket.received += 1;
            }
        });

        return monthFrames;
    }, [safeOrders]);

    const weeklyRevenue = useMemo(() => {
        const currentWeek = getWeekStart(new Date());
        const weekFrames = Array.from({ length: 8 }).map((_, index) => {
            const date = new Date(currentWeek);
            date.setDate(date.getDate() - (7 * (7 - index)));
            return {
                key: date.toISOString().slice(0, 10),
                label: `${date.getDate()} ${MONTH_NAMES[date.getMonth()]}`,
                value: 0,
            };
        });

        const weekMap = new Map(weekFrames.map((item) => [item.key, item]));

        receivedTransactions.forEach((transaction: any) => {
            const date = toDate(transaction?.createdAt || transaction?.date || transaction?.updatedAt);
            if (!date) return;

            const weekStart = getWeekStart(date).toISOString().slice(0, 10);
            const bucket = weekMap.get(weekStart);
            if (!bucket) return;

            bucket.value += getTransactionAmount(transaction);
        });

        return weekFrames;
    }, [receivedTransactions]);

    const topProducts = useMemo(() => {
        const productMap = new Map<string, { title: string; quantity: number; revenue: number }>();

        safeOrders.forEach((order: any) => {
            const orderItems = Array.isArray(order?.orderItems) ? order.orderItems : [];

            orderItems.forEach((item: any) => {
                const product = item?.product || {};
                const id = String(product?._id || product?.id || item?._id || `${product?.title || "Unknown"}`);
                const title = product?.title || "Untitled Product";
                const quantity = Number(item?.quantity || 0);
                const revenue = Number(item?.sellingPrice || 0) * quantity;

                if (!productMap.has(id)) {
                    productMap.set(id, { title, quantity: 0, revenue: 0 });
                }

                const current = productMap.get(id)!;
                current.quantity += quantity;
                current.revenue += revenue;
            });
        });

        return Array.from(productMap.values())
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 5);
    }, [safeOrders]);

    const monthlyMax = Math.max(...ordersByMonth.map((entry) => entry.received + entry.cancelled), 1);

    const availableYears = useMemo(() => {
        const years = new Set<number>([now.getFullYear()]);

        receivedTransactions.forEach((transaction: any) => {
            const date = toDate(transaction?.createdAt || transaction?.date || transaction?.updatedAt);
            if (date) {
                years.add(date.getFullYear());
            }
        });

        return Array.from(years).sort((a, b) => b - a);
    }, [now, receivedTransactions]);

    const monthlySalesByDay = useMemo(() => {
        const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
        const dayBuckets = Array.from({ length: daysInMonth }).map((_, index) => ({
            day: index + 1,
            sales: 0,
        }));

        receivedTransactions.forEach((transaction: any) => {
            const date = toDate(transaction?.createdAt || transaction?.date || transaction?.updatedAt);
            if (!date) return;
            if (date.getFullYear() !== selectedYear || date.getMonth() !== selectedMonth) return;

            const dayIndex = date.getDate() - 1;
            if (!dayBuckets[dayIndex]) return;

            dayBuckets[dayIndex].sales += getTransactionAmount(transaction);
        });

        return dayBuckets;
    }, [receivedTransactions, selectedMonth, selectedYear]);

    const maxDailySales = Math.max(...monthlySalesByDay.map((item) => item.sales), 1);
    const totalSelectedMonthSales = monthlySalesByDay.reduce((sum, item) => sum + item.sales, 0);
    const avgDailySales = monthlySalesByDay.length ? totalSelectedMonthSales / monthlySalesByDay.length : 0;

    const loading = orderLoading || productLoading || transactionLoading || reportLoading;
    const hasError = orderError || productError || transactionError || reportError;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Seller Dashboard</h1>
                <p className="text-sm text-slate-600">
                    Order performance, cancellations, revenue trend, and product-level movement.
                </p>
            </div>

            {hasError && <Alert severity="error">{orderError || productError || transactionError || reportError}</Alert>}

            {loading && !safeOrders.length && !safeProducts.length && !safeTransactions.length ? (
                <div className="flex justify-center py-12">
                    <CircularProgress />
                </div>
            ) : (
                <>
                    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
                        <div className="rounded-xl border border-slate-200 bg-white p-4">
                            <p className="text-xs text-slate-500">Total Orders Received</p>
                            <h2 className="mt-2 text-2xl font-bold text-slate-900">{totalOrders}</h2>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-white p-4">
                            <p className="text-xs text-slate-500">Cancelled Orders</p>
                            <h2 className="mt-2 text-2xl font-bold text-rose-600">{cancelledOrders.length}</h2>
                            <p className="text-xs text-slate-500 mt-1">{cancellationRate.toFixed(1)}% cancellation rate</p>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-white p-4">
                            <p className="text-xs text-slate-500">Delivered Orders</p>
                            <h2 className="mt-2 text-2xl font-bold text-emerald-600">{deliveredOrders.length}</h2>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-white p-4">
                            <p className="text-xs text-slate-500">Active Products</p>
                            <h2 className="mt-2 text-2xl font-bold text-slate-900">{activeProducts.length}</h2>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-white p-4">
                            <p className="text-xs text-slate-500">Net Revenue</p>
                            <h2 className="mt-2 text-2xl font-bold text-teal-700">
                                {formatCurrency(reports?.netEarnings || totalRevenue)}
                            </h2>
                        </div>
                    </section>

                    <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <div className="rounded-xl border border-slate-200 bg-white p-5">
                            <h3 className="text-base font-semibold text-slate-900">Orders Received Over Time</h3>
                            <p className="text-xs text-slate-500 mt-1">Last 6 months: received vs cancelled orders.</p>
                            <div className="mt-4 space-y-3">
                                {ordersByMonth.map((entry) => {
                                    const total = entry.received + entry.cancelled;
                                    const totalWidth = `${(total / monthlyMax) * 100}%`;
                                    const cancelledShare = total ? (entry.cancelled / total) * 100 : 0;

                                    return (
                                        <div key={entry.key}>
                                            <div className="flex justify-between text-xs text-slate-600 mb-1">
                                                <span>{entry.label}</span>
                                                <span>
                                                    {entry.received} received / {entry.cancelled} cancelled
                                                </span>
                                            </div>
                                            <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                                                <div className="h-full rounded-full bg-teal-500 relative" style={{ width: totalWidth }}>
                                                    <div
                                                        className="h-full bg-rose-500"
                                                        style={{ width: `${cancelledShare}%`, marginLeft: `${100 - cancelledShare}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white p-5">
                            <h3 className="text-base font-semibold text-slate-900">Revenue Trend</h3>
                            <p className="text-xs text-slate-500 mt-1">Weekly received payment amount for last 8 weeks.</p>
                            <div className="mt-4">
                                <TinyLineChart points={weeklyRevenue.map((item) => item.value)} />
                            </div>
                            <div className="mt-3 grid grid-cols-4 gap-2 text-[11px] text-slate-500">
                                {weeklyRevenue.map((week) => (
                                    <div key={week.key}>
                                        <p>{week.label}</p>
                                        <p className="font-semibold text-slate-700">{formatCurrency(week.value)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <div className="rounded-xl border border-slate-200 bg-white p-5">
                            <h3 className="text-base font-semibold text-slate-900">Top Products by Orders</h3>
                            <p className="text-xs text-slate-500 mt-1">Most ordered products from seller orders.</p>

                            <div className="mt-4 space-y-3">
                                {!topProducts.length ? (
                                    <p className="text-sm text-slate-500">No product order data yet.</p>
                                ) : (
                                    topProducts.map((product, index) => (
                                        <div
                                            key={`${product.title}-${index}`}
                                            className="flex items-center justify-between rounded-lg border border-slate-100 p-3"
                                        >
                                            <div>
                                                <p className="font-medium text-slate-900">{product.title}</p>
                                                <p className="text-xs text-slate-500">Qty ordered: {product.quantity}</p>
                                            </div>
                                            <Chip label={formatCurrency(product.revenue)} color="primary" size="small" />
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white p-5">
                            <div className="flex items-start justify-between gap-3 flex-wrap">
                                <div>
                                    <h3 className="text-base font-semibold text-slate-900">Monthly Sales Report</h3>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Daily sales trend for selected month and year.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4">
                                <p className="text-xs font-semibold text-slate-600 mb-2">Select Year</p>
                                <div className="flex flex-wrap gap-2">
                                    {availableYears.map((year) => (
                                        <button
                                            key={year}
                                            type="button"
                                            onClick={() => setSelectedYear(year)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                                                selectedYear === year
                                                    ? "bg-teal-600 text-white border-teal-600"
                                                    : "bg-white text-slate-700 border-slate-300 hover:border-teal-400"
                                            }`}
                                        >
                                            {year}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-4">
                                <p className="text-xs font-semibold text-slate-600 mb-2">Select Month</p>
                                <div className="flex flex-wrap gap-2">
                                    {MONTH_NAMES.map((monthName, monthIndex) => (
                                        <button
                                            key={monthName}
                                            type="button"
                                            onClick={() => setSelectedMonth(monthIndex)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                                                selectedMonth === monthIndex
                                                    ? "bg-indigo-600 text-white border-indigo-600"
                                                    : "bg-white text-slate-700 border-slate-300 hover:border-indigo-400"
                                            }`}
                                        >
                                            {monthName}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-5 h-48 w-full rounded-lg border border-slate-100 bg-slate-50 p-3">
                                {!monthlySalesByDay.some((item) => item.sales > 0) ? (
                                    <div className="h-full flex items-center justify-center text-sm text-slate-500">
                                        No sales data available for this month.
                                    </div>
                                ) : (
                                    <div className="h-full w-full flex items-end gap-1.5 overflow-x-auto">
                                        {monthlySalesByDay.map((item) => {
                                            const height = `${Math.max((item.sales / maxDailySales) * 100, item.sales > 0 ? 6 : 1)}%`;
                                            return (
                                                <div key={item.day} className="flex flex-col items-center min-w-2.5">
                                                    <div
                                                        className="w-2.5 rounded-t bg-teal-500"
                                                        style={{ height }}
                                                        title={`Day ${item.day}: ${formatCurrency(item.sales)}`}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                                <div className="rounded-lg border border-slate-200 p-3">
                                    <p className="text-slate-500">Total Sales ({MONTH_NAMES[selectedMonth]} {selectedYear})</p>
                                    <p className="mt-1 font-semibold text-slate-900">{formatCurrency(totalSelectedMonthSales)}</p>
                                </div>
                                <div className="rounded-lg border border-slate-200 p-3">
                                    <p className="text-slate-500">Average Daily Sales</p>
                                    <p className="mt-1 font-semibold text-slate-900">{formatCurrency(avgDailySales)}</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </>
            )}
        </div>
    );
};