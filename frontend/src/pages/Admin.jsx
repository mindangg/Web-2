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

import Confirm from '../components/Confirm'

export default function Admin() {
    const { admin } = useAdminContext()
    const { logout } = useAdminLogout()

    const [toggle, setToggle] = useState('user')

    const [showSideNav, setShowSideNav] = useState(true)

    return admin ? (
    <div>
        <div className='admin-header'>
            <div>
                <img src={logo} alt='Logo' />
            </div>
            <div className='toggleBar' onClick={() => setShowSideNav(!showSideNav)}>
                <i className="fa-solid fa-bars"></i>
            </div>
        </div>
        {/* {showSideNav && (
            <div className="overlay" onClick={() => setShowSideNav(false)}></div>
        )} */}

        <div className={`sidenav ${showSideNav ? 'show' : 'hide'}`}>
            <ul>
                <li className={toggle === 'user' ? 'active' : ''} onClick={() => setToggle('user')}><i className='fa-solid fa-users'></i> Người dùng</li>
                <li className={toggle === 'employee' ? 'active' : ''} onClick={() => setToggle('employee')}><i className='fa-solid fa-user-tie'></i> Nhân viên</li>
                <li className={toggle === 'product' ? 'active' : ''} onClick={() => setToggle('product')}><i className='fa-solid fa-book'></i> Sản phẩm</li>
                <li className={toggle === 'supplier' ? 'active' : ''} onClick={() => setToggle('supplier')}><i className='fa-solid fa-truck-field'></i> Kho hàng</li>
                <li className={toggle === 'order' ? 'active' : ''} onClick={() => setToggle('order')}><i className='fa-solid fa-basket-shopping'></i> Đơn hàng</li>
                <li className={toggle === 'order-statistic' ? 'active' : ''} onClick={() => setToggle('order-statistic')}><i className='fa-solid fa-chart-simple'></i> Thống kê</li>
            </ul>
            
            <ul>
                <li><i className="fa-solid fa-pen-ruler" style={{paddingTop: '0px'}}></i> {admin.employee.role_name}</li>
                <li><i className='fa-regular fa-circle-user'></i> {admin.employee.full_name}</li>
                <li onClick={logout}><i className='fa-solid fa-arrow-right-from-bracket'></i> Logout</li>
            </ul>
        </div>
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
