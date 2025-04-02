import React, { useState } from 'react'

import '../styles/Admin.css'

// import { useAdminLogin } from '../hooks/useAdminLogin'

export default function AdminLogin() {
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')

    // const { login, error, isLoading } = useAdminLogin()

    const handleSubmit = async (e) => {
        e.preventDefault()

        // await login(phone, password)
    }

    return (
        <div className='admin-login-container'>
            <form id='admin-login' onSubmit={handleSubmit}>
                <h1>Admin</h1>

                <div className='admin-login-input'>
                    <input type='text' placeholder='Phone number' value={phone} 
                            onChange={(e) => setPhone(e.target.value)}></input>
                </div>

                <div className='admin-login-input'>
                    <input type='password' placeholder='Password' value={password}
                            onChange={(e) => setPassword(e.target.value)}></input>
                </div>
                <button type='submit' id='admin-login-btn'>Login</button>
                
                {/* {error && <div className='error'>{error}</div>} */}
            </form>
        </div>
    )
}
