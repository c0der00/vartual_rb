import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import Singup from './pages/Singup.jsx'
import Signin from './pages/signin.jsx'
import Home from './pages/Home.jsx'

const router = createBrowserRouter(
  [
    { 
    path:"/",
    element:<App/>,
    children:[
      {
        path:"",
        element:<Home />
      },
      {
        path:"/signup",
        element:<Singup/>
      },
      {
        path:"/signin",
        element:<Signin/>
      }
    ],
    },
      
  ]
 
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
