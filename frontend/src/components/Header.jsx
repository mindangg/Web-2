import React, { useState } from 'react'

import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'

import '../styles/Header.css'

import { useAuthContext } from '../hooks/useAuthContext'
import { useLogout } from '../hooks/useLogout'
import { useNotificationContext } from '../hooks/useNotificationContext'

export default function Header() {
    const { user } = useAuthContext()
    const { logout } = useLogout()
    const { showNotification } = useNotificationContext()
    const navigate = useNavigate()

    const handleClick = () => {
        if (!user)
            showNotification('Please login to view cart') 
        else
            navigate('/cart')
    }

    const [toggle, setToggle] = useState('home')

    return (
        <header>
            <div className='header'>
                <div className='search'>
                    <Link to={'/'}>
                        <img src={logo} alt='logo'></img>
                    </Link>
                    <input placeholder={'Nhập thứ cần tìm...'}></input>
                    <span><i className='fa-solid fa-magnifying-glass'></i></span>
                </div>

                <div className='action'>
                    <i class="fa-solid fa-user"></i>
                    {!user ? <Link to='/login'>Đăng nhập</Link> : <Link onClick={logout}>Đăng xuất</Link>}
                    <i className="fa-solid fa-basket-shopping"></i>
                    <Link onClick={handleClick}>Giỏ hàng</Link>
                </div>
            </div>

            <div className='nav-container'>
                <nav className='nav'>
                    <Link to='/' onClick={() => setToggle('home')} className={toggle === 'home' ? 'active' : ''}>HOME</Link>
                    <Link to={'/product'} onClick={() => setToggle('product')} className={toggle === 'product' ? 'active' : ''}>PRODUCT</Link>
                    <Link to={'/product?brand=apple'} onClick={() => setToggle('apple')} className={toggle === 'apple' ? 'active' : ''}>IPHONE</Link>
                    <Link to={'/product?brand=samsung'} onClick={() => setToggle('samsung')} className={toggle === 'samsung' ? 'active' : ''}>SAMSUNG</Link>
                    <Link to={'/product?brand=oppo'} onClick={() => setToggle('oppo')} className={toggle === 'oppo' ? 'active' : ''}>OPPO</Link>
                    <Link to={'/product?brand=huawei'} onClick={() => setToggle('huawei')} className={toggle === 'huawei' ? 'active' : ''}>HUAWEI</Link>
                    <Link to={'/product?brand=realme'} onClick={() => setToggle('realme')} className={toggle === 'realme' ? 'active' : ''}>REALME</Link>
                    <Link to={'/product?brand=vivo'} onClick={() => setToggle('vivo')} className={toggle === 'vivo' ? 'active' : ''}>VIVO</Link>
                    <Link to={'/product?brand=xiaomi'} onClick={() => setToggle('xiaomi')} className={toggle === 'xiaomi' ? 'active' : ''}>XIAOMI</Link>
                </nav>
            </div>
        </header>
    )
}
