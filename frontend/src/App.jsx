import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation  } from 'react-router-dom'

// pages
import Login from './pages/Login'
import Signup from './pages/Signup'

export default function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}
