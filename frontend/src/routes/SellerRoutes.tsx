import { lazy, Suspense } from "react"
import { Route, Routes } from "react-router"
import { RouteLoader } from "../common/RouteLoader"

const HomePage = lazy(() =>
    import("../seller/HomePage/HomePage").then((module) => ({
        default: module.HomePage,
    })),
)
const Product = lazy(() =>
    import("../seller/Products/Product").then((module) => ({
        default: module.Product,
    })),
)
const AddProduct = lazy(() =>
    import("../seller/Products/AddProduct").then((module) => ({
        default: module.AddProduct,
    })),
)
const EditProduct = lazy(() =>
    import("../seller/Products/EditProduct").then((module) => ({
        default: module.EditProduct,
    })),
)
const Order = lazy(() =>
    import("../seller/Orders/Order").then((module) => ({
        default: module.Order,
    })),
)
const Account = lazy(() =>
    import("../seller/Account/Account").then((module) => ({
        default: module.Account,
    })),
)
const Transaction = lazy(() =>
    import("../seller/Transaction/Transaction").then((module) => ({
        default: module.Transaction,
    })),
)
const Payment = lazy(() =>
    import("../seller/Payment/Payment").then((module) => ({
        default: module.Payment,
    })),
)

export const SellerRoutes=()=>{
    return(
        <Suspense fallback={<RouteLoader label="Loading seller page..." />}>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/dashboard" element={<HomePage/>}/>
                <Route path="/products" element={<Product/>}/>
                <Route path="/add-product" element={<AddProduct/>}/>
                <Route path="/products/:productId/edit" element={<EditProduct/>}/>
                <Route path="/orders" element={<Order/>}/>
                <Route path="/account" element={<Account/>}/>
                <Route path="/transactions" element={<Transaction/>}/>
                <Route path="/payments" element={<Payment/>}/>
                {/* <Route path="/dashboard" element={<SellerDashboard/>}/> */}
            </Routes>
        </Suspense>
    )
}
