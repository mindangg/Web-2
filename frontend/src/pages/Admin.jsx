import React, { useState } from 'react'

import logo from '../assets/SGU STORE.png'
import '../styles/Admin.css'
import CreateProduct from '../components/CreateProduct'
import DeleteProduct from '../components/DeleteProduct'
import CreateCatalog from '../components/CreateCatalog'

import AdminProduct from '../pages/AdminProduct'
import AdminOrder from '../pages/AdminOrder'
import AdminUser from '../pages/AdminUser'
import AdminEmployee from '../pages/AdminEmployee'
import AdminOrderStatistic from '../pages/AdminOrderStatistic'

import AdminLogin from './AdminLogin'

export default function Admin() {
    const [toggle, setToggle] = useState('product')

    return (
    <div>
        <div className='sidenav'>
            <div className='ok'>
                <div className='topnav'>
                        <img src={logo} alt='Logo' />
                </div>
                <div className='middlenav'>
                    <ul>
                        <li onClick={() => setToggle('product')}><i className='fa-solid fa-book'></i> Product</li>
                        <li onClick={() => setToggle('supplier')}><i className='fa-solid fa-truck-field'></i> Supplier</li>
                        <li onClick={() => setToggle('user')}><i className='fa-solid fa-users'></i> User</li>
                        <li onClick={() => setToggle('order')}><i className='fa-solid fa-basket-shopping'></i> Order</li>
                        <li onClick={() => setToggle('employee')}><i className='fa-solid fa-user-tie'></i> Employee</li>
                        <li onClick={() => setToggle('order-statistic')}><i className='fa-solid fa-chart-simple'></i> Order Statistic</li>
                    </ul>
                </div>
            </div>
            <div className='bottomnav'>
                <ul>
                    <li><i className='fa-regular fa-circle-user'></i> </li>
                    <li><i className='fa-solid fa-phone'></i> </li>
                    <li><i className='fa-solid fa-arrow-right-from-bracket'></i> Logout</li>
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

    // <AdminLogin/>
    )
}
