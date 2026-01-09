
import { ThemeProvider } from '@emotion/react'
import './App.css'
import { customTheme } from './Theme/custom_theme'
// import Home from './customer/pages/Home/Home'
import { Products } from './customer/pages/Product/Product'

function App() {
  

  return (
  <ThemeProvider theme={customTheme}>
      {/* <Home /> */}
      <Products/>
  </ThemeProvider>
  )
}

export default App
