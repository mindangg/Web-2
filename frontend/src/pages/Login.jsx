import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import logo from '../assets/logo.png'

import { useLogin } from '../hooks/useLogin'

export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const { login, error, isLoading } = useLogin()
    
    const handleSubmit = async (e) => {
        e.preventDefault()

        await login(username, password)
    }

    return (
        <div className='login-container'>
            <div className='login-logo'>
                <img src={logo}></img>
                <h4>
                    Hi there, do you have money? Tell<br/>
                    me how much, i will give you things<br/>
                    you need<br/>
                </h4>

                <Link to='/'>
                <div>
                    <i className="fa-solid fa-reply"></i>
                    Trang chủ
                </div>
                </Link>
            </div>
            <form id='login' onSubmit={handleSubmit}>
                <div>
                    <input type='text' placeholder='Username'
                            value={username} onChange={(e) => setUsername(e.target.value)}></input>
                </div>

                <div>
                    <input type='password' placeholder='Mật khẩu'
                            value={password} onChange={(e) => setPassword(e.target.value)}></input>
                </div>

                <div>
                    <button type='submit' disabled={isLoading}>Đăng nhập</button>
                </div>

                <div>
                    <Link to='#'><i>Bạn quên mật khẩu?</i></Link>
                </div>

                <div>
                    <label><i>Bạn chưa có tài khoản?</i></label>
                    <Link to='/signup'><i>Đăng ký</i></Link>
                </div>

                {error && <div className='error'>{error}</div>}
                {/* <div className='error'>Error fuck you</div> */}
            </form>
        </div>
  )
}
