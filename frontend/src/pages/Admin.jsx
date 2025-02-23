import React from 'react'

import logo from '../assets/SGU STORE.png'
import '../styles/Admin.css'
import CreateProduct from '../components/CreateProduct'

export default function Admin() {
    return (
        <>
    <div className='header-ad'>
        <div className ="header-logo">
            <img src={logo}></img>
        </div>
        <div>
            Admin
        </div>

    </div>
        <div className ="menu">
            <div>Hệ thống quản trị</div>
            <div><i className="fa-solid fa-user"></i><a>Sản phẩm</a><i className="fa-solid fa-chevron-down"></i></div>
            <div><i className="fa-solid fa-user"></i><a>Danh mục</a><i className="fa-solid fa-chevron-down"></i></div>
            <div><i className="fa-solid fa-user"></i><a>Đơn hàng</a><i className="fa-solid fa-chevron-down"></i></div>
            <div><i className="fa-solid fa-user"></i><a>Khách hàng</a><i className="fa-solid fa-chevron-down"></i></div>  
            <div className = 'createProduct'><CreateProduct/></div>
        
        </div>
        </>

    )
}
