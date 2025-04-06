import React, { useState } from 'react'

import logo from '../assets/SGU STORE.png'
import '../styles/Admin.css'

import AdminLogin from './AdminLogin'
import AdminProduct from '../pages/AdminProduct'
import AdminOrder from '../pages/AdminOrder'
import AdminUser from '../pages/AdminUser'
import AdminEmployee from '../pages/AdminEmployee'
import AdminOrderStatistic from '../pages/AdminOrderStatistic'

import { useAdminContext } from '../hooks/useAdminContext'
import { useAdminLogout } from '../hooks/useAdminLogout'

export default function Admin() {
    const { admin } = useAdminContext()
    const { logout } = useAdminLogout()

    const [toggle, setToggle] = useState('user')

    const [showSideNav, setShowSideNav] = useState(false);


    return admin ? (
    <div>
        <button
            className="hamburger-btn"
            onClick={() => setShowSideNav(prev => !prev)}
        >
            <i className="fa-solid fa-bars"></i>
        </button>

        {/* Optional overlay to click outside and close sidenav */}
        {/* {showSideNav && (
            <div className="overlay" onClick={() => setShowSideNav(false)}></div>
        )} */}

        <div className={`sidenav ${showSideNav ? 'show' : 'hide'}`}>
            <div>
                <div className='topnav'>
                        <img src={logo} alt='Logo' />
                </div>
                <div className='middlenav'>
                    <ul>
                        <li onClick={() => setToggle('user')}><i className='fa-solid fa-users'></i> Người dùng</li>
                        <li onClick={() => setToggle('employee')}><i className='fa-solid fa-user-tie'></i> Nhân viên</li>
                        <li onClick={() => setToggle('product')}><i className='fa-solid fa-book'></i> Sản phẩm</li>
                        <li onClick={() => setToggle('supplier')}><i className='fa-solid fa-truck-field'></i> Kho hàng</li>
                        <li onClick={() => setToggle('order')}><i className='fa-solid fa-basket-shopping'></i> Đơn hàng</li>
                        <li onClick={() => setToggle('order-statistic')}><i className='fa-solid fa-chart-simple'></i> Thống kê</li>
                    </ul>
                </div>
            </div>
            <div className='bottomnav'>
                <ul>
                    <li><i className="fa-solid fa-pen-ruler"></i> {admin.employee.role_name}</li>
                    <li><i className='fa-regular fa-circle-user'></i> {admin.employee.full_name}</li>
                    <li onClick={logout}><i className='fa-solid fa-arrow-right-from-bracket'></i> Logout</li>
                </ul>
            </div>
        </div>
        {/* <div className ="menu">
            <div>Hệ thống quản trị</div>
            <div><i className="fa-solid fa-user"></i><a>Sản phẩm</a><i className="fa-solid fa-chevron-down"></i></div>
            <div><i className="fa-solid fa-user"></i><a>Danh mục</a><i className="fa-solid fa-chevron-down"></i></div>
            <div><i className="fa-solid fa-user"></i><a>Đơn hàng</a><i className="fa-solid fa-chevron-down"></i></div>
            <div><i className="fa-solid fa-user"></i><a>Khách hàng</a><i className="fa-solid fa-chevron-down"></i></div>  

        </div> */}
        <div className='content'>
            {toggle === 'product' && <AdminProduct />}
            {/* {toggle === 'supplier' && <AdminSupplier />} */}
            {toggle === 'user' &&  <AdminUser />}
            {toggle === 'order' && <AdminOrder />}
            {toggle === 'employee' && <AdminEmployee />}
            {toggle === 'order-statistic' && <AdminOrderStatistic />}
            {/* {toggle === 'stock-statistic' && canAccess('stock-statistic') && <AdminStockStatistic />} */}
        </div>
    </div>
    ) : (
        <AdminLogin/>
    )
}
