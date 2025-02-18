import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    return (
        <div>
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
                    <Link to='#'><i>Bạn quên mật khẩu?</i></Link><br/>
                </div>

                <div>
                    <label><i>Bạn chưa có tài khoản?</i></label>
                    <Link to='/signup'><i>Đăng ký</i></Link>
                </div>
            </form>
        </div>
  )
}
