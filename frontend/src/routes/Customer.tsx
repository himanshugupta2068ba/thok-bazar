import { lazy, Suspense } from "react"
import { Route } from "react-router"
import { Footer } from "../customer/Footer/Footer"
import { Routes } from "react-router"
import { Navbar } from "../customer/Navbar/Navbar"
import { CustomerProtectedRoute } from "./CustomerProtectedRoute"
import { RouteLoader } from "../common/RouteLoader"

const Home = lazy(() => import("../customer/pages/Home/Home"))
const Products = lazy(() =>
  import("../customer/pages/Product/Product").then((module) => ({
    default: module.Products,
  })),
)
const ProductDetails = lazy(() =>
  import("../customer/pages/Product/ProductDetails/ProductDetails").then((module) => ({
    default: module.ProductDetails,
  })),
)
const Cart = lazy(() =>
  import("../customer/pages/Cart/cart").then((module) => ({
    default: module.Cart,
  })),
)
const Checkout = lazy(() =>
  import("../customer/pages/Checkout/Checkout").then((module) => ({
    default: module.Checkout,
  })),
)
const Profile = lazy(() =>
  import("../customer/pages/Order/Profile").then((module) => ({
    default: module.Profile,
  })),
)
const Wishlist = lazy(() =>
  import("../customer/pages/Wishlist/Wishlist").then((module) => ({
    default: module.Wishlist,
  })),
)
const PaymentSuccess = lazy(() =>
  import("../customer/pages/Order/PaymentSuccess").then((module) => ({
    default: module.PaymentSuccess,
  })),
)
const CustomerAssistant = lazy(() =>
  import("../customer/assistant/CustomerAssistant").then((module) => ({
    default: module.CustomerAssistant,
  })),
)

export const CustomerRoutes = () => {
    return (
        <>
 <Navbar/>
      <Suspense fallback={<RouteLoader label="Loading page..." />}>
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
      </Suspense>
      <Suspense fallback={null}>
        <CustomerAssistant />
      </Suspense>
      <Footer/>
        </>)
}
