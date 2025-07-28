import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import Singup from './pages/Singup.jsx'
import Signin from './pages/signin.jsx'
import Home from './pages/Home.jsx'
import { Provider } from 'react-redux'
import AuthLayout from './componens/AuthLayout.jsx'
import {store,  persistor } from './redux/store.js'
import { PersistGate } from 'redux-persist/integration/react'
import Costamize from './componens/Costamize.jsx'
import Costamixe from './componens/Costamixe.jsx'


const router = createBrowserRouter(
  [
    { 
    path:"/",
    element:<App/>,
    children:[
      {
        path:"",
        element:(
          <AuthLayout authentication={true}>
            <Home/>
          </AuthLayout>
        )
      },
      {
        path:"/signup",
        element:(
          <AuthLayout authentication={false}>
            <Singup/>
          </AuthLayout>
        )
      },
      {
        path:"/signin",
        element:(
          <AuthLayout authentication={false}>
            <Signin/>
          </AuthLayout>
        )
      },
      {
        path:"/costamize",
        element:(
          <AuthLayout authentication={true}>
            <Costamize/>
          </AuthLayout>
        )
      },
      {
        path:"/costamixe",
        element:(
          <AuthLayout authentication={true}>
            <Costamixe/>
          </AuthLayout>
        )
      },
    ],
    },
      
  ]
 
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router}/>
      </PersistGate>
    </Provider>
  </StrictMode>,
)
