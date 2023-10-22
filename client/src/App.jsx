import Login from './pages/login';
import Category from "./pages/category";
import Home from "./pages/home";
import Layout from './layout/user';
import AdminLayout from './layout/admin';
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useEffect, useMemo } from 'react';
import { isNil, propOr } from 'ramda';
import { useSelector } from 'react-redux';
import Registration from './pages/register';
import Profile from './pages/profile';
import CardPage from './pages/card';
import Containers from './pages/containers';
import Products from './pages/products';
import Busket from './pages/busket';
import Categories from "./pages/categories";
import Chat from './pages/chat';

const pathes=[
  {
    path: "/login",
    dataKey: "/login",
    component: <Login />,
  },
  {
    path: "/registration",
    dataKey: "/registration",
    component: <Registration />,
  },
  {
    path: "/profile",
    dataKey: "/profile",
    component: <Profile />,
  },
  {
    path: "/home",
    dataKey: "/home",
    component: <Home />,
  },
  {
    path: "/containers",
    dataKey: "/containers",
    component: <Containers />,
  },
  {
    path: "/container/:id/products",
    dataKey: "/products",
    component: <Products />,
  },
  {
    path: "/category/:categoryId",
    dataKey: "/category",
    component: <Category />,
  },
  {
    path: "/card/:productId",
    dataKey: "/card",
    component: <CardPage />,
  },
  {
    path: "/busket",
    dataKey: "/busket",
    component: <Busket />,
  },
  {
    path: "/categories",
    dataKey: "/categories",
    component: <Categories />,
  },
  {
    path: "/chat",
    dataKey: "/chat",
    component: <Chat />,
  },
  
]

const App = () => {
  const {pathname} = useLocation()
  const navigate = useNavigate()
  const authStore = useSelector(store=>store.auth)

  useEffect(() => {
    if(isNil(propOr(null, "token", authStore))){
      if(pathname==="/registration"){
        return 
      }
      if(pathname==="/login"){
        return 
      }
      return navigate("/login")
    }

    const valid = pathes
      .map(({dataKey})=>dataKey)
        .some(item=>pathname.includes(item))

    if(!valid){
      navigate("/home")
    }
  }, [navigate, pathname, authStore]);

  useEffect(() => {
    if(
      ["/login", "/registration"].includes(pathname)
      &&
      !isNil(propOr(null, "token", authStore))
    ){
      navigate("/home")
    } 
  }, [authStore, navigate, pathname]);

  const LyaoutComponent=useMemo(() => {
    if(authStore.role==="admin"){
      return AdminLayout
    }
    return Layout
  }, [authStore])

  return (
    <Routes>
          <Route>
            {
              pathes.map(item=>{
                if(["/login", "/registration"].includes(item.path)){
                  return (
                    <Route
                      key={item.path}
                      path={item.dataKey} 
                      element={item.component} 
                    />
                  )
                }
                return (
                  <Route
                    key={item.path}
                    path={item.path} 
                    element={
                      <LyaoutComponent>
                        {item.component}
                      </LyaoutComponent>
                    } 
                  />
                )
              })
            }
          </Route>
    </Routes>
  )
}

export default App
