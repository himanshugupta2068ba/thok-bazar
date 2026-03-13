
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
import { fetchSellerProfile } from './Redux Toolkit/featurs/seller/sellerSlice'
import { createHomeCategory, fetchHomeCategories } from './Redux Toolkit/featurs/coustomer/homeCategorySlice'
import { homeCategories } from './data/homeCategory'

function App() {
  
  const dispatch=useAppDispatch();
  const {auth}=useAppSelector((state)=>state);

  useEffect(()=>{
    const jwt = auth.jwt?.trim() || localStorage.getItem("jwt");
    const sellerJwt= localStorage.getItem("sellerJwt");

    if(sellerJwt){
      dispatch(fetchSellerProfile(sellerJwt));
    }
    if(jwt){
      dispatch(fetchUserProfile(jwt));
      // dispatch(fetchSellerProfile());
    }
  },[auth.jwt,dispatch])


  useEffect(()=>{
    dispatch(createHomeCategory(homeCategories))
      .unwrap()
      .catch(() => {
        dispatch(fetchHomeCategories());
      });
  },[dispatch])
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
  </ThemeProvider>
  )
}

export default App
