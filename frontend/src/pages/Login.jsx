import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import logo from '../assets/WEBTOON_Logo.png'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    return (
        <div className='login-container'>
            <div className='login-logo'>
                <img src={logo}></img>
                <h4>
                    Hi there, do you have money? Tell<br/>
                    me how much, i will you things<br/>
                    you need<br/>
                </h4>

                <Link to='/'>
                <div>
                    <i className="fa-solid fa-reply"></i>
                    Trang chủ
                </div>
                </Link>
            </div>
            <form id='login'>
                <div>
                    <input type='text' placeholder='Email'
                            value={email} onChange={(e) => setEmail(e.target.value)}></input>
                </div>

                <div>
                    <input type='password' placeholder='Mật khẩu'
                            value={password} onChange={(e) => setPassword(e.target.value)}></input>
                </div>

                <div>
                    <button>Đăng nhập</button>
                </div>

                <div>
                    <Link to='#'><i>Bạn quên mật khẩu?</i></Link>
                </div>

                <div>
                    <label><i>Bạn chưa có tài khoản?</i></label>
                    <Link to='/signup'><i>Đăng ký</i></Link>
                </div>
            </form>
        </div>
  )
}
