
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

function App() {
  

  return (
  <ThemeProvider theme={customTheme}>
    <Navbar/>
      {/* <Home /> */}
      {/* <Products/>
      */}
      {/* <ProductDetails/> */}
      {/* <Cart/> */}
      {/* <Checkout/> */}
      <Profile/>
      <Footer/> 
  </ThemeProvider>
  )
}

export default App
