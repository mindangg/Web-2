import React, { useState } from 'react'

import '../styles/Checkout.css'

import QR from '../assets/QR.jpg'
import CheckoutItems from '../components/CheckoutItems'

export default function Checkout() {
    const [fullname, setFullname] = useState('')
    const [phone, setPhone] = useState('')
    const [streetName, setStreetName] = useState('')
    const [street, setStreet] = useState('')
    const [ward, setWard] = useState('')
    const [district, setDistrict] = useState('')
    const [city, setCity] = useState('')

    const [method, setMethod] = useState('cash')

    const handlePayment = (methodCheck) => {
        if (methodCheck === 'cash')
            setMethod('cash')

        if (methodCheck === 'qr')
            setMethod('qr')

        if (methodCheck === 'card')
            setMethod('card')
    }

    return (
        <div className='checkout'>
            <div className='checkout-payment'>
                <h2>Thông tin đơn hàng</h2>
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

                <h2>Thanh toán</h2>

                <select onChange={(e) => handlePayment(e.target.value)}>
                    <option value='cash'>Thanh toán tiền mặt</option>
                    <option value='qr'>Chuyển khoản QR</option>
                    <option value='card'>Chuyển khoản ngân hàng</option>
                </select>

                {method == 'qr' && (
                    <div id='paymentByQR'>
                        <img src={QR} style={{width: 200 + 'px'}}></img>
                    </div>
                )}

                {method == 'card' && (
                    <div id='paymentByCard'>
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
                    <CheckoutItems/>
                    <CheckoutItems/>
                    <CheckoutItems/>
                </div>
                <div style={{fontWeight: 'bold'}}>Total: 100.000.000 đ</div>
            </div>
        </div>
    )
}
