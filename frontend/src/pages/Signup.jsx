// import React, { useState } from 'react'
// import { Link } from 'react-router-dom'

// import logo from '../assets/logo.png'

// export default function Signup() {
//     const [fullname, setFullname] = useState('')
//     const [email, setEmail] = useState('')
//     const [phone, setPhone] = useState('')
//     const [username, setUsername] = useState('')
//     const [password, setPassword] = useState('')
//     const [confPassword, setConfPassword] = useState('')

//     return (
//         <div className='signup-container'>
//             <div className='signup-logo'>
//                 <img src={logo}></img>
//                 <h4>
//                     Đăng ký ngay để nhận được nhiều<br/>
//                     khuyến mãi đặc biệt
//                 </h4>
//             </div>
//             <form id='signup'>
//                 <h2>Tạo tài khoản</h2>

//                 <div>
//                     <input type='text' placeholder='Nhập họ và tên'
//                             value={fullname} onChange={(e) => setFullname(e.target.value)}></input>
//                 </div>

//                 <div> 
//                     <input type='text' placeholder='Email'
//                             value={email} onChange={(e) => setEmail(e.target.value)}></input>
//                 </div>

//                 <div>
//                     <input type='tel' placeholder='Số điện thoại'
//                             value={phone} onChange={(e) => setPhone(e.target.value)}></input>
//                 </div>

//                 <div>
//                     <input type='text' placeholder='Tên đăng nhập'
//                             value={username} onChange={(e) => setUsername(e.target.value)}></input>
//                 </div>

//                 <div>
//                     <input type='password' placeholder='Mật khẩu'
//                             value={password} onChange={(e) => setPassword(e.target.value)}></input>
//                 </div>

//                 <div>
//                     <input type='password' placeholder='Xác nhận mật khẩu'
//                             value={confPassword} onChange={(e) => setConfPassword(e.target.value)}></input>
//                 </div>

//                 <div className='signup-btns'>
//                     <button><Link to='/signup'>Quay lại</Link></button>
//                     <button>Đăng ký</button>
//                 </div>
//             </form>
//         </div>
//     )
// }

import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import logo from '../assets/logo.png'

import { useSignup } from '../hooks/useSignup'

export default function Signup() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confPassword, setConfPassword] = useState('')

    const { signup, error, setError, isLoading } = useSignup()
    
    const handleSubmit = async (e) => {
        e.preventDefault()

        if (password !== confPassword) {
            console.log('Password does not match')
            return setError('Password does not match')
        }


        await signup(username, email, password)
    }

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
                    <input type='text' placeholder='Username'
                            value={username} onChange={(e) => setUsername(e.target.value)}></input>
                </div>

                <div>
                    <input type='text' placeholder='Email'
                            value={email} onChange={(e) => setEmail(e.target.value)}></input>
                </div>

                <div>
                    <input type='password' placeholder='Mật khẩu'
                            value={password} onChange={(e) => setPassword(e.target.value)}></input>
                </div>

                <div>
                    <input type='password' placeholder='Nhập lại mật khẩu'
                            value={confPassword} onChange={(e) => setConfPassword(e.target.value)}></input>
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
            </form>
        </div>
  )
}
