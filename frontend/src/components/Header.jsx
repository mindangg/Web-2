import React from 'react'

import { Link } from 'react-router-dom'

import logo from '../assets/SGU STORE.png'

import '../styles/Header.css'

export default function Header() {
    return (
        <header>
            <div className='header'>
                <div className='search'>
                    <img src={logo}></img>
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
                    <Link to={'/product'} className='navlink'>IPHONE</Link>
                    <Link className='navlink'>SAMSUNG</Link>
                    <Link className='navlink'>OPPO</Link>
                    <Link className='navlink'>HUAWEI</Link>
                    <Link className='navlink'>REALME</Link>
                    <Link className='navlink'>VIVO</Link>
                    <Link className='navlink'>XIAOMI</Link>
                </nav>
            </div>
        </header>
    )
}
