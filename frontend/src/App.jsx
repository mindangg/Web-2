import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation  } from 'react-router-dom'

// pages
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Product from './pages/Product'
import Admin from './pages/Admin'


//components
import Header from './components/Header'
import Footer from './components/Footer'


export default function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        {/* <Header/> */}
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/product' element={<Product/>}/>
          <Route path='/admin' element={<Admin/>}/>
        </Routes>
      </BrowserRouter>
        {/* <Footer/> */}
    </div>
  )
}
