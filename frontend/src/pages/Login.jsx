import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

import logo from '../assets/logo.png'

import { useLogin } from '../hooks/useLogin'

export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const usernameRef = useRef(null)
    const passwordRef = useRef(null)

    const { login, error, isLoading } = useLogin()
    
    const handleSubmit = async (e) => {
        e.preventDefault()

        await login(username, password)
    }
    useEffect(() => {
    if (error?.includes('username') || error?.includes('tên'))
        usernameRef.current?.focus()

    else if (error?.includes('mật khẩu'))
        passwordRef.current?.focus()

    }, [error])

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
                    <input type='text' placeholder='Username' ref={usernameRef}
                            value={username} onChange={(e) => setUsername(e.target.value)}
                            className={error?.includes('username') || error?.includes('tên') ? 'input-error' : ''}></input>
                </div>

                <div>
                    <input type='password' placeholder='Mật khẩu' ref={passwordRef}
                            value={password} onChange={(e) => setPassword(e.target.value)}
                            className={error?.includes('mật khẩu') || error?.includes('Sai mật khẩu') ? 'input-error' : ''}></input>
                </div>

                <div>
                    <button type='submit' disabled={isLoading}>Đăng nhập</button>
                </div>

                <div>
                    <label><i>Bạn chưa có tài khoản?</i></label>
                    <Link to='/signup'><i>Đăng ký</i></Link>
                </div>

                {error && <div className='error'>{error}</div>}
            </form>
        </div>
  )
}
