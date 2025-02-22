import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation  } from 'react-router-dom'

// pages
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Admin from './pages/Admin'

//components
import Header from './components/Header'
import Footer from './components/Footer'

const Layout = () => {
  const hideLayout = useLocation().pathname === '/admin'

  return (
    <div className='App'>
      {!hideLayout && <Header/>}
      <div className='pages'>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/admin' element={<Admin/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/cart' element={<Cart/>}/>
          <Route path='/checkout' element={<Checkout/>}/>
        </Routes>
      </div>
      {/* <Notification/>
      <CardDetails/> */}
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
