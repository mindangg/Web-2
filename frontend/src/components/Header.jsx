import React from 'react'

import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'

import '../styles/Header.css'

export default function Header() {
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
                    <Link to='/login'>Đăng nhập </Link>
                    <Link to='/cart'><i className='fa-solid fa-bag-shopping'></i></Link>
                </div>
            </div>

            <div className='nav-container'>
                <nav className='nav'>
                    <Link to='/' className='navlink'>HOME</Link>
                    <Link to={'/product'} className='navlink'>PRODUCT</Link>
                    <Link to={'/product?brand=apple'} className='navlink'>IPHONE</Link>
                    <Link to={'/product?brand=samsung'} className='navlink'>SAMSUNG</Link>
                    <Link to={'/product?brand=oppo'} className='navlink'>OPPO</Link>
                    <Link to={'/product?brand=huawei'} className='navlink'>HUAWEI</Link>
                    <Link to={'/product?brand=realme'} className='navlink'>REALME</Link>
                    <Link to={'/product?brand=vivo'} className='navlink'>VIVO</Link>
                    <Link to={'/product?brand=xiaomi'} className='navlink'>XIAOMI</Link>
                </nav>
            </div>
        </header>
    )
}
