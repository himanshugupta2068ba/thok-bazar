
import { ThemeProvider } from '@emotion/react'
import './App.css'
import { customTheme } from './Theme/custom_theme'
import Home from './customer/pages/Home/Home'

function App() {
  

  return (
  <ThemeProvider theme={customTheme}>
      <Home />
  </ThemeProvider>
  )
}

export default App
