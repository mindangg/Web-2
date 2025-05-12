import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

import logo from '../assets/logo.png'

import { useSignup } from '../hooks/useSignup'

export default function Signup() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confPassword, setConfPassword] = useState('')
    
    const usernameRef = useRef(null)
    const emailRef = useRef(null)
    const passwordRef = useRef(null)
    const confPasswordRef = useRef(null)

    const { signup, error, setError, isLoading } = useSignup()
    
    const handleSubmit = async (e) => {
        e.preventDefault()

        if (password !== confPassword)
            return setError('Mật khẩu không khớp')

        await signup(username, email, password)
    }

    useEffect(() => {
        if (!error) 
            return

        if (error.includes('username'))
            usernameRef.current?.focus()

        else if (error.includes('Email') || error.includes('email'))
            emailRef.current?.focus()

        else if (error.includes('Mật khẩu không khớp'))
            confPasswordRef.current?.focus()

        else if (error.includes('Mật khẩu') || error.includes('mật khẩu'))
            passwordRef.current?.focus()

    }, [error])

    return (
        <div className='signup-container'>
            <div className='signup-logo'>
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
            <form id='signup' onSubmit={handleSubmit}>
                <div>
                    <input type='text' placeholder='Username' ref={usernameRef}
                            value={username} onChange={(e) => setUsername(e.target.value)}
                            className={error?.includes('username') ? 'input-error' : ''}></input>
                </div>

                <div>
                    <input type='text' placeholder='Email' ref={emailRef}
                            value={email} onChange={(e) => setEmail(e.target.value)}
                            className={error?.includes('email') ? 'input-error' : ''}></input>
                </div>

                <div>
                    <input type='password' placeholder='Mật khẩu' ref={passwordRef}
                            value={password} onChange={(e) => setPassword(e.target.value)}
                            className={error?.includes('mật khẩu') || error?.includes('dài') ? 'input-error' : ''}></input>
                </div>

                <div>
                    <input type='password' placeholder='Nhập lại mật khẩu' ref={confPasswordRef}
                            value={confPassword} onChange={(e) => setConfPassword(e.target.value)}
                            className={error?.includes('khớp') ? 'input-error' : ''}></input>
                </div>

                <div style={{textAlign: 'center'}}>
                    <button type='submit' disabled={isLoading}>Đăng ký</button>
                </div>

                <div>
                    <Link to='home'><i>Quay lại trang chủ</i></Link>
                </div>

                <div>
                    <label><i>Bạn đã có tài khoản?</i></label>
                    <Link to='/login'><i>Đăng nhập</i></Link>
                </div>

                {error && <div className='error'>{error}</div>}
            </form>
        </div>
  )
}
