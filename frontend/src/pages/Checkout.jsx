import React, { useEffect, useState } from 'react'

import '../styles/Checkout.css'

import QR from '../assets/QR.jpg'
import CheckoutItems from '../components/CheckoutItems'

import { useAuthContext } from '../hooks/useAuthContext'
import { useCartContext } from '../hooks/useCartContext'

export default function Checkout() {
    const { user } = useAuthContext()
    const { cart, dispatch } = useCartContext()

    const [currentUser, setCurrenUser] = useState([])

    const [fullname, setFullname] = useState('')
    const [phone, setPhone] = useState('')
    const [streetName, setStreetName] = useState('')
    const [street, setStreet] = useState('')
    const [ward, setWard] = useState('')
    const [district, setDistrict] = useState('')
    const [city, setCity] = useState('')

    const [edit, setEdit] = useState('show')
    const [method, setMethod] = useState('cash')
    const [showReceipt, setShowReceipt] = useState(false)

    const handlePayment = (methodCheck) => {
        if (methodCheck === 'cash')
            setMethod('cash')

        if (methodCheck === 'qr')
            setMethod('qr')

        if (methodCheck === 'card')
            setMethod('card')
    }

    useEffect(() => {
        if (user?.user?.user_account_id) {
            const fetchUser = async () => {
                const response = await fetch('http://localhost/api/user/' + user.user.user_account_id, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                })
    
                if (!response.ok)
                    throw new Error('Failed to fetch user')
                
                const json = await response.json()

                setCurrenUser(json)

                const exists = JSON.parse(localStorage.getItem(`cart_${user.user.user_account_id}`)) || []

                dispatch({ type: 'DISPLAY_ITEM', payload: exists})
            }
    
            fetchUser()
        }
    }, [user, dispatch])

    const handleCheckout = async () => {
        try {
            const response = await fetch(`http://localhost/api/order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${admin.token}`
                },
                body: JSON.stringify(updatedData)
            })

            if (!response.ok)
                throw new Error('Failed to update employee')
  
            const json = await response.json()
        }
        catch (error) {
            console.error('Error updating employee:', error)
        }

    }

    return (
        <div className='checkout'>
            <div className='checkout-payment'>
                <h2>Thông tin đơn hàng</h2>
                <select value={edit} onChange={(e) => setEdit(e.target.value)}>
                    <option value='show'>Địa chỉ và thông tin người dùng hiện tại</option>
                    <option value='edit'>Địa chỉ và thông tin người dùng mới</option>
                </select>
                {edit === 'show' && currentUser ? (
                <>
                    <label>Họ tên</label>
                    <input type='text' value={currentUser.full_name} readOnly={true}></input>

                    <label>Số điện thoại</label>
                    <input type='text' value={currentUser.phone_number} readOnly={true}></input>

                    <label>Số nhà</label>
                    <input type='text' value={currentUser.house_number} readOnly={true}></input>

                    <label>Đường</label>
                    <input type='text' value={currentUser.street} readOnly={true}></input>

                    <label>Huyện</label>
                    <input type='text' value={currentUser.ward} readOnly={true}></input>

                    <label>Quận</label>
                    <input type='text' value={currentUser.district} readOnly={true}></input>

                    <label>Thành phố</label>
                    <input type='text' value={currentUser.city} readOnly={true}></input>
                </>
                ) : (
                <>
                    <label>Họ tên</label>
                    <input type='text' value={fullname} placeholder='Họ tên'
                            onChange={(e) => setFullname(e.target.value)}></input>

                    <label>Số điện thoại</label>
                    <input type='tel' value={phone} placeholder='Số điện thoại'
                            onChange={(e) => setPhone(e.target.value)}></input>

                    <label>Số nhà</label>
                    <input type='text' value={streetName} placeholder='Số nhà'
                            onChange={(e) => setStreetName(e.target.value)}></input>

                    <label>Đường</label>
                    <input type='text' value={street} placeholder='Đường'
                            onChange={(e) => setStreet(e.target.value)}></input>

                    <label>Huyện</label>
                    <input type='text' value={ward} placeholder='Huyện'
                            onChange={(e) => setWard(e.target.value)}></input>

                    <label>Quận</label>
                    <input type='text' value={district} placeholder='Quận'
                            onChange={(e) => setDistrict(e.target.value)}></input>

                    <label>Thành phố</label>
                    <input type='text' value={city} placeholder='Thành phố'
                            onChange={(e) => setCity(e.target.value)}></input>
                </>
                )}

  

                <h2>Thanh toán</h2>

                <select onChange={(e) => handlePayment(e.target.value)}>
                    <option value='cash'>Thanh toán tiền mặt</option>
                    <option value='qr'>Chuyển khoản QR</option>
                    <option value='card'>Chuyển khoản ngân hàng</option>
                </select>

                {method === 'qr' && (
                    <div id='paymentByQR'>
                        <img src={QR} style={{width: 200 + 'px', height: 200 + 'px'}}></img>
                    </div>
                )}

                {method === 'card' && (
                    <div id='paymentByCard'>
                        <label>Chọn thẻ ngân hàng</label>
                        <select defaultValue='Vietcombank'>
                            <option value='Vietcombank'>Vietcombank</option>
                            <option value='Agribank'>Agribank</option>
                            <option value='ACB'>ACB</option>
                            <option value='Vietinbank'>Vietinbank</option>
                            <option value='Techcombank'>Techcombank</option>
                            <option value='BIDV'>BIDV</option>
                            <option value='MB'>MB</option>
                            <option value='VPBank'>VPBank</option>
                            <option value='TPBank'>TPBank</option>
                            <option value='VIB'>VIB</option>
                        </select>
                        <div>
                            <label>Số thẻ</label>
                            <input type='text' placeholder='Số thẻ'></input>
                            <label className='error'></label>
                        </div>
                        <div>
                            <label>Họ tên trên thẻ</label>
                            <input type='text' placeholder='Họ tên'></input>
                            <label className='error' ></label>
                        </div>
                    </div>
                )}

                <button>Thanh toán</button>     
            </div>

            <div className='checkout-info'>
                <div className='checkout-items'>
                    <div className='checkout-header'>
                        <span>Sản phẩm</span>
                        <span>Model</span>
                        <span>Số lượng</span>
                        <span>Giá</span>
                    </div>
                    {cart && cart.length > 0 && (
                        cart.map(c => (
                            <CheckoutItems key={c.sku_id} cart={c}/>
                        ))
                    )}
                </div>
                <div style={{fontWeight: 'bold', fontSize: '20px'}}>Tổng tiền: {cart.reduce((sum, item) => sum + (item.invoice_price * item.quantity), 0)} $</div>
                <div>
                    <button onClick={() => setShowReceipt(!showReceipt)}>
                        Xem hóa đơn chi tiết
                    </button>
                </div>
            </div>
            {showReceipt && (
                <div className='receipt-container'>
                    <div className='receipt'>
                        <i className="fa-solid fa-xmark" onClick={() => setShowReceipt(!showReceipt)}></i>
                        {/* <i className="fa-solid fa-circle-xmark"></i> */}
                        <h2>Hóa đơn chi tiết</h2>
                    </div>
                </div>
            )}
        </div>
    )
}
