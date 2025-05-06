import React, { useEffect, useState } from 'react'

import logo from '../assets/SGU STORE.png'
import '../styles/Admin.css'

import AdminLogin from './AdminLogin'
import AdminProduct from '../pages/AdminProduct'
import AdminOrder from '../pages/AdminOrder'
import AdminUser from '../pages/AdminUser'
import AdminEmployee from '../pages/AdminEmployee'
import AdminOrderStatistic from '../pages/AdminOrderStatistic'
import AdminUserStatistic from '../pages/AdminUserStatistic'

import { useAdminContext } from '../hooks/useAdminContext'
import { useAdminLogout } from '../hooks/useAdminLogout'

import { useSearchParams } from "react-router-dom"

export default function Admin() {
    const { admin } = useAdminContext()
    const { logout } = useAdminLogout()

    const [toggle, setToggle] = useState('user')
    const [searchParams, setSearchParams] = useSearchParams('')
    const [showSideNav, setShowSideNav] = useState(true)

    useEffect(() => {
        setSearchParams({})
    }, [toggle])

    // Helper function for role-based access
    const hasAccess = (functionName, action = "Xem") => {
        const functions = admin?.employee?.[0]?.role?.functions || []
        const matchedFunc = functions.find(f => f.function_name === functionName)
        return matchedFunc?.actions?.includes(action)
    }

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

            <div className={`sidenav ${showSideNav ? 'show' : 'hide'}`}>
                <ul>
                    {hasAccess("Người dùng") && (
                        <li className={toggle === 'user' ? 'active' : ''} onClick={() => setToggle('user')}>
                            <i className='fa-solid fa-users'></i> Người dùng
                        </li>
                    )}
                    {hasAccess("Nhân viên") && (
                        <li className={toggle === 'employee' ? 'active' : ''} onClick={() => setToggle('employee')}>
                            <i className='fa-solid fa-user-tie'></i> Nhân viên
                        </li>
                    )}
                    {hasAccess("Sản phẩm") && (
                        <li className={toggle === 'product' ? 'active' : ''} onClick={() => setToggle('product')}>
                            <i className='fa-solid fa-book'></i> Sản phẩm
                        </li>
                    )}
                    {hasAccess("Kho hàng") && (
                        <li className={toggle === 'supplier' ? 'active' : ''} onClick={() => setToggle('supplier')}>
                            <i className='fa-solid fa-truck-field'></i> Kho hàng
                        </li>
                    )}
                    {hasAccess("Đơn hàng") && (
                        <li className={toggle === 'order' ? 'active' : ''} onClick={() => setToggle('order')}>
                            <i className='fa-solid fa-basket-shopping'></i> Đơn hàng
                        </li>
                    )}
                    {hasAccess("Thống kê") && (
                        <li className={toggle === 'order-statistic' ? 'active' : ''} onClick={() => setToggle('order-statistic')}>
                            <i className='fa-solid fa-chart-simple'></i> Thống kê
                        </li>
                    )}
                </ul>

                <ul>
                    <li>
                        <i className="fa-solid fa-pen-ruler" style={{ paddingTop: '0px' }}></i> {admin.employee?.[0]?.role?.role_name || 'No Role'}
                    </li>
                    <li>
                        <i className='fa-regular fa-circle-user'></i> {admin.employee?.[0]?.full_name || 'No Name'}
                    </li>
                    <li onClick={logout}>
                        <i className='fa-solid fa-arrow-right-from-bracket'></i> Logout
                    </li>
                </ul>
            </div>

            <div className='content'>
                {toggle === 'product' && hasAccess("Sản phẩm") && <AdminProduct />}
                {toggle === 'user' && hasAccess("Người dùng") && <AdminUser />}
                {toggle === 'order' && hasAccess("Đơn hàng") && <AdminOrder />}
                {toggle === 'employee' && hasAccess("Nhân viên") && <AdminEmployee />}
                {/* {toggle === 'order-statistic' && hasAccess("Thống kê") && <AdminOrderStatistic />} */}
                {toggle === 'order-statistic' && hasAccess("Thống kê") && <AdminUserStatistic />}
                {toggle === 'supplier' && hasAccess("Kho hàng") && (
                    <div style={{ padding: '2rem' }}>Chức năng kho hàng chưa được triển khai.</div>
                )}
            </div>
        </div>
    ) : (
        <AdminLogin />
    )
}
