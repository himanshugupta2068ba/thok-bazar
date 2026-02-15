import { Route, Routes } from "react-router"
// import { Dashboard } from "../admin/Dashboard/Dashboard"

import { CouponForm } from "../admin/Coupon/couponForm"
import { Coupon } from "../admin/Coupon/coupon"
import { GridTable } from "../admin/HomePage/GridTable"
import { ShopByCategory } from "../admin/HomePage/ShopByCategory"
import { Deal } from "../admin/Deal/Deal"
import { SellerTables } from "../admin/Seller/SellerTable"
import { ElectronicTable } from "../admin/HomePage/ElectronicsTable"
export const AdminRoutes = () => {
    return (
       <Routes>
        {/* <Route path="/seller-table" element={<SellerTables/>}/> */}
        <Route path="/" element={<SellerTables/>}/>
        <Route path="/add-coupon" element={<CouponForm/>}/>
        <Route path="/electronics-table" element={<ElectronicTable/>}/>
        <Route path="/home-grid" element={<GridTable/>}/>
        <Route path="/coupon" element={<Coupon/>}/>
        <Route path="/shop-by-category" element={<ShopByCategory/>}/>
        <Route path="/deal" element={<Deal/>}/>
       </Routes>
    )
}