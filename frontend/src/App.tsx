
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
import { BecomeSeller } from './auth/BecomeSeller/BecomeSeller'
import { CustomerRoutes } from './routes/Customer'
import { Auth } from './auth/Login/Auth'
import { Dashboard } from './admin/Dashboard/Dashboard'

function App() {
  

  return (
  <ThemeProvider theme={customTheme}>
    

{/* //seller routes */}
<Routes>
  <Route path='/seller/*' element={<SellerDashboard/>}/>
  <Route path='/become-seller' element={<BecomeSeller/>}/>
  <Route path='/login' element={<Auth/>}/>
  <Route path='/*' element={<CustomerRoutes/>}/>
   <Route path='/admin/*' element={<Dashboard/>}/>

</Routes>
        <Footer/> 
  </ThemeProvider>
  )
}

export default App
