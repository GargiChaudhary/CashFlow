import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@mui/material'
import { RouterProvider } from 'react-router-dom'
import "./index.css"
import router from './routes/router.jsx'
import theme from './theme/index.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <RouterProvider router={router}></RouterProvider>
    </ThemeProvider>
  </StrictMode>
)
