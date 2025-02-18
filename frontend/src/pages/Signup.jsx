import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import logo from '../assets/WEBTOON_Logo.png'

export default function Signup() {
    const [fullname, setFullname] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confPassword, setConfPassword] = useState('')

    return (
        <div id='signup-container'>
            <div className='signup-logo'>
                <img src={logo}></img>
                <h4>Đăng ký ngay để nhận được nhiều</h4>
                <h4>khuyến mãi đặc biệt</h4>
            </div>
            <form id='signup'>
                <h2>Tạo tài khoản</h2>

                <div>
                    <input type='text' placeholder='Nhập họ và tên'
                            value={fullname} onChange={(e) => setFullname(e.target.value)}></input>
                </div>

                <div> 
                    <input type='text' placeholder='Email'
                            value={email} onChange={(e) => setEmail(e.target.value)}></input>
                </div>

                <div>
                    <input type='tel' placeholder='Số điện thoại'
                            value={phone} onChange={(e) => setPhone(e.target.value)}></input>
                </div>

                <div>
                    <input type='text' placeholder='Tên đăng nhập'
                            value={username} onChange={(e) => setUsername(e.target.value)}></input>
                </div>

                <div>
                    <input type='password' placeholder='Mật khẩu'
                            value={password} onChange={(e) => setPassword(e.target.value)}></input>
                </div>

                <div>
                    <input type='password' placeholder='Xác nhận mật khẩu'
                            value={confPassword} onChange={(e) => setConfPassword(e.target.value)}></input>
                </div>

                <div className='signup-btns'>
                    <button><Link to='/login'>Quay lại</Link></button>

                    <button>Đăng ký</button>
                </div>
            </form>
        </div>
    )
}
