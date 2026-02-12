import { Route } from "react-router"
import { Footer } from "../customer/Footer/Footer"
import { Routes } from "react-router"
import Home from "../customer/pages/Home/Home"
import { Products } from "../customer/pages/Product/Product"
import { ProductDetails } from "../customer/pages/Product/ProductDetails/ProductDetails"
import { Profile } from "../seller/Account/Profile"
import { Cart } from "../customer/pages/Cart/cart"
import { Checkout } from "../customer/pages/Checkout/Checkout"
import { Navbar } from "../customer/Navbar/Navbar"

export const CustomerRoutes = () => {
    return (
        <>
 <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/products/:categoryId' element={<Products/>}/>
        <Route path='/product-details/:categoryId/:name/:productId' element={<ProductDetails/>}/>
        <Route path='/cart' element={<Cart/>}/> 
         <Route path='/checkout/address' element={<Checkout/>}/> 
         <Route path='/customer/profile/*' element={<Profile/>}/>  
      </Routes> 
      <Footer/>
        </>)
}