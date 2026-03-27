import { ThemeProvider } from '@emotion/react'
import './App.css'
import { customTheme } from './Theme/custom_theme'
import { Route, Routes } from 'react-router'
import { useAppDispatch, useAppSelector } from './Redux Toolkit/store'
import { lazy, Suspense, useEffect } from 'react'
import { fetchUserProfile } from './Redux Toolkit/featurs/coustomer/userSlice'
import { fetchHomeCategories } from './Redux Toolkit/featurs/coustomer/homeCategorySlice'
import { clearCartState, fetchCart } from './Redux Toolkit/featurs/coustomer/cartSlice'
import { buildWishlistUserKey, initializeWishlist } from './Redux Toolkit/featurs/coustomer/wishlistSlice'
import { SellerProtectedRoute } from './routes/SellerProtectedRoute'
import { getValidCustomerJwt, isCustomerJwtExpired } from './util/customerSession'
import { PublicStorefrontLayout } from './routes/PublicStorefrontLayout'
import { AdminProtectedRoute } from './routes/AdminProtectedRoute'
import { RouteLoader } from './common/RouteLoader'

const SellerDashboard = lazy(() =>
  import('./seller/SellerDashboard/SellerDashboards').then((module) => ({
    default: module.SellerDashboard,
  })),
)
const BecomeSeller = lazy(() =>
  import('./auth/BecomeSeller/BecomeSeller').then((module) => ({
    default: module.BecomeSeller,
  })),
)
const CustomerRoutes = lazy(() =>
  import('./routes/Customer').then((module) => ({
    default: module.CustomerRoutes,
  })),
)
const Auth = lazy(() =>
  import('./auth/Login/Auth').then((module) => ({
    default: module.Auth,
  })),
)
const Dashboard = lazy(() =>
  import('./admin/Dashboard/Dashboard').then((module) => ({
    default: module.Dashboard,
  })),
)
const AdminLogin = lazy(() =>
  import('./admin/Auth/AdminLogin').then((module) => ({
    default: module.AdminLogin,
  })),
)

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
  <Route
    path='/seller/*'
    element={
      <SellerProtectedRoute>
        <Suspense fallback={<RouteLoader label="Loading seller area..." />}>
          <SellerDashboard/>
        </Suspense>
      </SellerProtectedRoute>
    }
  />
  <Route
    path='/become-seller'
    element={
      <Suspense fallback={<RouteLoader label="Loading seller signup..." />}>
        <BecomeSeller/>
      </Suspense>
    }
  />
  <Route
    path='/login'
    element={
      <PublicStorefrontLayout>
        <Suspense fallback={<RouteLoader label="Loading login..." />}>
          <Auth/>
        </Suspense>
      </PublicStorefrontLayout>
    }
  />
  <Route
    path='/admin/login'
    element={
      <PublicStorefrontLayout>
        <Suspense fallback={<RouteLoader label="Loading admin login..." />}>
          <AdminLogin/>
        </Suspense>
      </PublicStorefrontLayout>
    }
  />
  <Route
    path='/*'
    element={
      <Suspense fallback={<RouteLoader label="Loading storefront..." />}>
        <CustomerRoutes/>
      </Suspense>
    }
  />
   <Route
    path='/admin/*'
    element={
      <AdminProtectedRoute>
        <Suspense fallback={<RouteLoader label="Loading admin area..." />}>
          <Dashboard/>
        </Suspense>
      </AdminProtectedRoute>
    }
  />

</Routes>
  </ThemeProvider>
  )
}

export default App
