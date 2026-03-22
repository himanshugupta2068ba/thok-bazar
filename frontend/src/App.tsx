
import { ThemeProvider } from '@emotion/react'
import './App.css'
import { customTheme } from './Theme/custom_theme'
import { Route, Routes } from 'react-router'
import { SellerDashboard } from './seller/SellerDashboard/SellerDashboards'
import { BecomeSeller } from './auth/BecomeSeller/BecomeSeller'
import { CustomerRoutes } from './routes/Customer'
import { Auth } from './auth/Login/Auth'
import { Dashboard } from './admin/Dashboard/Dashboard'
import { useAppDispatch, useAppSelector } from './Redux Toolkit/store'
import { useEffect } from 'react'
import { fetchUserProfile } from './Redux Toolkit/featurs/coustomer/userSlice'
import { fetchHomeCategories } from './Redux Toolkit/featurs/coustomer/homeCategorySlice'
import { clearCartState, fetchCart } from './Redux Toolkit/featurs/coustomer/cartSlice'
import { buildWishlistUserKey, initializeWishlist } from './Redux Toolkit/featurs/coustomer/wishlistSlice'
import { SellerProtectedRoute } from './routes/SellerProtectedRoute'
import { getValidCustomerJwt, isCustomerJwtExpired } from './util/customerSession'
import { PublicStorefrontLayout } from './routes/PublicStorefrontLayout'
import { AdminProtectedRoute } from './routes/AdminProtectedRoute'
import { AdminLogin } from './admin/Auth/AdminLogin'

function App() {
  
  const dispatch=useAppDispatch();
  const {auth, user}=useAppSelector((state)=>state);
  const wishlistUserKey = buildWishlistUserKey(auth.user, user.user);

  useEffect(()=>{
    const stateJwt = auth.jwt?.trim();
    const jwt = stateJwt && !isCustomerJwtExpired(stateJwt) ? stateJwt : getValidCustomerJwt();
    if(jwt){
      dispatch(fetchUserProfile(jwt));
      dispatch(fetchCart(jwt));
      // dispatch(fetchSellerProfile());
    } else {
      dispatch(clearCartState());
    }
  },[auth.jwt,dispatch])

  useEffect(() => {
    dispatch(initializeWishlist(wishlistUserKey));
  }, [dispatch, wishlistUserKey]);


  useEffect(()=>{
    dispatch(fetchHomeCategories());
  },[dispatch])
  return (
  <ThemeProvider theme={customTheme}>
    

{/* //seller routes */}
<Routes>
  <Route path='/seller/*' element={<SellerProtectedRoute><SellerDashboard/></SellerProtectedRoute>}/>
  <Route path='/become-seller' element={<BecomeSeller/>}/>
  <Route path='/login' element={<PublicStorefrontLayout><Auth/></PublicStorefrontLayout>}/>
  <Route path='/admin/login' element={<PublicStorefrontLayout><AdminLogin/></PublicStorefrontLayout>}/>
  <Route path='/*' element={<CustomerRoutes/>}/>
   <Route path='/admin/*' element={<AdminProtectedRoute><Dashboard/></AdminProtectedRoute>}/>

</Routes>
  </ThemeProvider>
  )
}

export default App
