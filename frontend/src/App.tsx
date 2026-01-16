
import { ThemeProvider } from '@emotion/react'
import './App.css'
import { customTheme } from './Theme/custom_theme'
// import Home from './customer/pages/Home/Home'
import { Products } from './customer/pages/Product/Product'
import { Footer } from './customer/Footer/Footer'
import { ProductDetails } from './customer/pages/Product/ProductDetails/ProductDetails'

function App() {
  

  return (
  <ThemeProvider theme={customTheme}>
      {/* <Home /> */}
      {/* <Products/>
      */}
      <ProductDetails/>
      <Footer/> 
  </ThemeProvider>
  )
}

export default App
