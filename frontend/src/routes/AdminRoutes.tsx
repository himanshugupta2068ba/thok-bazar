import { lazy, Suspense } from "react"
import { Route, Routes } from "react-router"
import { RouteLoader } from "../common/RouteLoader"

const CouponForm = lazy(() =>
    import("../admin/Coupon/couponForm").then((module) => ({
        default: module.CouponForm,
    })),
)
const Coupon = lazy(() =>
    import("../admin/Coupon/coupon").then((module) => ({
        default: module.Coupon,
    })),
)
const GridTable = lazy(() =>
    import("../admin/HomePage/GridTable").then((module) => ({
        default: module.GridTable,
    })),
)
const ShopByCategory = lazy(() =>
    import("../admin/HomePage/ShopByCategory").then((module) => ({
        default: module.ShopByCategory,
    })),
)
const Deal = lazy(() =>
    import("../admin/Deal/Deal").then((module) => ({
        default: module.Deal,
    })),
)
const SellerTables = lazy(() =>
    import("../admin/Seller/SellerTable").then((module) => ({
        default: module.SellerTables,
    })),
)
const ElectronicTable = lazy(() =>
    import("../admin/HomePage/ElectronicsTable").then((module) => ({
        default: module.ElectronicTable,
    })),
)
const AdminOverview = lazy(() =>
    import("../admin/Dashboard/AdminOverview").then((module) => ({
        default: module.AdminOverview,
    })),
)
const AdminAccount = lazy(() =>
    import("../admin/Account/AdminAccount").then((module) => ({
        default: module.AdminAccount,
    })),
)
export const AdminRoutes = () => {
    return (
       <Suspense fallback={<RouteLoader label="Loading admin page..." />}>
        <Routes>
          <Route path="/" element={<AdminOverview/>}/>
          <Route path="/seller-table" element={<SellerTables/>}/>
          <Route path="/add-coupon" element={<CouponForm/>}/>
          <Route path="/electronics-table" element={<ElectronicTable/>}/>
          <Route path="/home-grid" element={<GridTable/>}/>
          <Route path="/coupon" element={<Coupon/>}/>
          <Route path="/shop-by-category" element={<ShopByCategory/>}/>
          <Route path="/deal" element={<Deal/>}/>
          <Route path="/account" element={<AdminAccount/>}/>
        </Routes>
       </Suspense>
    )
}
