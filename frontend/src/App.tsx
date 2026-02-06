
import { ThemeProvider } from '@emotion/react'
import './App.css'
import { customTheme } from './Theme/custom_theme'
import Home from './customer/pages/Home/Home'
import { Products } from './customer/pages/Product/Product'
import { Footer } from './customer/Footer/Footer'
import { ProductDetails } from './customer/pages/Product/ProductDetails/ProductDetails'
import { Cart } from './customer/pages/Cart/cart'
import { Checkout } from './customer/pages/Checkout/Checkout'
import { Navbar } from './customer/Navbar/Navbar'
import { Profile } from './customer/pages/Order/Profile'
import { Route, Routes } from 'react-router'
import { SellerDashboard } from './seller/SellerDashboard/SellerDashboards'

function App() {
  

  return (
  <ThemeProvider theme={customTheme}>
    {/* <Navbar/> */}
      {/* <Home /> */}
      {/* <Products/>
      */}
      {/* <ProductDetails/> */}
      {/* <Cart/> */}
      {/* <Checkout/> */}
      {/* <Profile/> */}
  
      {/* <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/products/:categoryId' element={<Products/>}/>
        <Route path='/product-details/:categoryId/:name/:productId' element={<ProductDetails/>}/>
        <Route path='/cart' element={<Cart/>}/> */}
        {/* <Route path='/checkout/address' element={<Checkout/>}/> */}
        {/* <Route path='/customer/profile/*' element={<Profile/>}/>  
      </Routes> */}

{/* //seller routes */}
<Routes>
  <Route path='/seller/*' element={<SellerDashboard/>}/>
</Routes>
        <Footer/> 
  </ThemeProvider>
  )
}

export default App
