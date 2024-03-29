import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from '../pages/HomePage/Home/Home'
import Login from '../pages/Login/Login'
import Signup from '../pages/Signup/Signup'
import Main from '../utilities/Main'
import Blog from '../pages/Blog/Blog.jsx'
import ContactUs from '../pages/Contact/ContactUs'
import CarBrandCategory from '../pages/CategoryPage/CarBrandCategory/CarBrandCategory'
import { async } from '@firebase/util'
import axios from 'axios'
import Dashbord from '../pages/DashbordLayout/Dashbord/Dashbord'
import DashbordData from '../pages/DashbordLayout/DashbordData/DashbordData'
import AddAProduct from '../pages/DashbordLayout/AddAProduct/AddAProduct'
import MyPorduct from '../pages/DashbordLayout/MyPorduct/MyPorduct'
import AllSellers from '../pages/DashbordLayout/AllSellers/AllSellers'
import AllBuyers from '../pages/DashbordLayout/AllBuyers/AllBuyers'
import PrivetRoute from './PrivetRoute'
import WishList from '../pages/DashbordLayout/WishList/WishList'
import Payment from '../pages/DashbordLayout/Payment/Payment'
import MyOrders from '../pages/DashbordLayout/MyOrders/MyOrders'
import ReportAdmin from '../pages/DashbordLayout/ReportAdmin/ReportAdmin'
import ErrorPage from '../pages/ErrorPage/ErrorPage'

const Routes = () => {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <Main />,
            errorElement: <ErrorPage />,
            children: [
                {
                    path: '/',
                    element: <Home />
                },
                {
                    path: '/signup',
                    element: <Signup />
                },
                {
                    path: '/login',
                    element: <Login />
                },
                {
                    path: '/blog',
                    element: <Blog />
                },
                {
                    path: '/contact',
                    element: <ContactUs />
                },
                {
                    path: '/category/:id',
                    element: <PrivetRoute><CarBrandCategory /></PrivetRoute>,
                    loader: async ({params}) => axios(`https://next-car-inky.vercel.app/category-car?brand=${params.id}`, {
                        headers: {
                            authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    })
                }
            ]
        },
        {
            path: '/dashbord',
            element: <PrivetRoute><Dashbord /></PrivetRoute>,
            errorElement: <ErrorPage />,
            children: [
                {
                    path: '/dashbord',
                    element: <DashbordData />
                },
                {
                    path: 'add-a-product',
                    element: <AddAProduct />
                },
                {
                    path: 'my-product',
                    element: <MyPorduct />
                },
                {
                    path: 'all-sellers',
                    element: <AllSellers />
                },
                {
                    path: 'all-buyers',
                    element: <AllBuyers />
                },
                {
                    path: 'my-wishlist',
                    element: <WishList />
                },
                {
                    path: 'payment/:id',
                    element: <Payment />,
                    loader: async ({params}) => await fetch(`https://next-car-md-farhadhossain.vercel.app/my-order/${params.id}`)
                },
                {
                    path: 'my-orders',
                    element: <MyOrders />
                },
                {
                    path: 'report-admin',
                    element: <ReportAdmin />
                }
            ]
        }
    ])
  return (
    <RouterProvider router={router}>Routes</RouterProvider>
  )
}

export default Routes