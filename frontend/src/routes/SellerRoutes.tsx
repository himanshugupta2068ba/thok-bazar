import { Route, Routes } from "react-router"
import { SellerDashboard } from "../seller/SellerDashboard/SellerDashboards"
import { HomePage } from "../seller/HomePage/HomePage"
import { Product } from "../seller/Products/Product"
import { AddProduct } from "../seller/Products/AddProduct"
import { Order } from "../seller/Orders/Order"
import { Account } from "../seller/Account/Account"
import { Transaction } from "../seller/Transaction/Transaction"
import { Payment } from "../seller/Payment/Payment"

export const SellerRoutes=()=>{
    return(
        <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/products" element={<Product/>}/>
            <Route path="/add-product" element={<AddProduct/>}/>
            <Route path="/orders" element={<Order/>}/>
            <Route path="/account" element={<Account/>}/>
            <Route path="/transactions" element={<Transaction/>}/>
            <Route path="/payments" element={<Payment/>}/>
            {/* <Route path="/dashboard" element={<SellerDashboard/>}/> */}
        </Routes>
    )
}