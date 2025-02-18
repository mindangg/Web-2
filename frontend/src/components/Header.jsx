import React from 'react'

import { Link } from 'react-router-dom'

import logo from '../assets/WEBTOON_Logo.png'

import '../styles/Header.css'

export default function Header() {
    return (
        <header>
            <div className='header'>
                <div className='search'>
                    <img src={logo}></img>
                    <input placeholder={'Nhập thứ cần tìm...'}></input>
                    <span><i className="fa-solid fa-magnifying-glass"></i></span>
                </div>

                <div className='action'>
                    <Link to='/login'>Đăng nhập </Link>
                    <i className="fa-solid fa-bag-shopping"></i>
                </div>
            </div>

            <nav className='navbar'>
                <Link className="navlink">IPHONE</Link>
                <Link className="navlink">SAMSUNG</Link>
                <Link className="navlink">OPPO</Link>
                <Link className="navlink">HUAWEI</Link>
                <Link className="navlink">REALME</Link>
                <Link className="navlink">VIVO</Link>
                <Link className="navlink">XIAOMI</Link>
                <Link className="navlink">NOKIA</Link>
            </nav>
        </header>
    )
}
