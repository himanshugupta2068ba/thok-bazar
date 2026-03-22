import { Route } from "react-router"
import { Footer } from "../customer/Footer/Footer"
import { Routes } from "react-router"
import Home from "../customer/pages/Home/Home"
import { Products } from "../customer/pages/Product/Product"
import { ProductDetails } from "../customer/pages/Product/ProductDetails/ProductDetails"
import { Cart } from "../customer/pages/Cart/cart"
import { Checkout } from "../customer/pages/Checkout/Checkout"
import { Navbar } from "../customer/Navbar/Navbar"
import { Profile } from "../customer/pages/Order/Profile"
import { Wishlist } from "../customer/pages/Wishlist/Wishlist"
import { PaymentSuccess } from "../customer/pages/Order/PaymentSuccess"
import { CustomerProtectedRoute } from "./CustomerProtectedRoute"

export const CustomerRoutes = () => {
    return (
        <>
 <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/products' element={<Products/>}/>
        <Route path='/products/:categoryId' element={<Products/>}/>
        <Route path='/product-details/:categoryId/:name/:productId' element={<ProductDetails/>}/>
        <Route path='/cart' element={<Cart/>}/> 
        <Route path='/wishlist' element={<Wishlist/>}/> 
        <Route path='/payment/success' element={<CustomerProtectedRoute><PaymentSuccess/></CustomerProtectedRoute>}/>
         <Route path='/checkout/address' element={<CustomerProtectedRoute><Checkout/></CustomerProtectedRoute>}/> 
         <Route path='/customer/profile/*' element={<CustomerProtectedRoute><Profile/></CustomerProtectedRoute>}/>  
      </Routes> 
      <Footer/>
        </>)
}
