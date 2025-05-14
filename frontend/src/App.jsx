import React, {useEffect, useState} from 'react'
import {BrowserRouter, Navigate, Route, Routes, useLocation} from 'react-router-dom'

// pages
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Admin from './pages/Admin'
import Payment from './pages/Payment.jsx'
import OrderHistory from './pages/OrderHistory.jsx'

//components
import Header from './components/Header'
import Footer from './components/Footer'
import {Product} from "./pages/Product.jsx";
import CardDetails from "./pages/ProductDetail.jsx";

import Notification from './components/Notification.jsx'
import {useAuthContext} from './hooks/useAuthContext.jsx'
import AdminWarranty from './pages/AdminWarranty.jsx'
import useHeaderContext from "./hooks/useHeaderContext.jsx";

const Layout = () => {
    const hideLayout = useLocation().pathname === '/admin'

    const {user} = useAuthContext()

  return (
    <div className='App'>
      {!hideLayout && <Header />}
      <div className='pages'>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path={`/product`} element={<Product/>}/>
           <Route path='/product/:id' element={<CardDetails/>}/>
          <Route path='/admin' element={<Admin/>}/>
          <Route path='/login' element={!user ? <Login/> : <Navigate to='/'/>}/>
          <Route path='/signup' element={!user ? <Signup/> : <Navigate to='/'/>}/>
          <Route path='/cart' element={<Cart/>}/>
          <Route path='/payment' element={<Payment/>}/>
          <Route path='/checkout' element={<Checkout/>}/>
          <Route path='/orderhistory' element={<OrderHistory/>}/>
          <Route path='/warranty' element={<AdminWarranty/>}/>
        </Routes>
      </div>
      <Notification/>
      {/* <CardDetails/> */}
            
      {!hideLayout && <Footer/>}
    </div>
  )
}

export default function App() {
    return (
        <BrowserRouter>
            <Layout/>
        </BrowserRouter>
    )
}
