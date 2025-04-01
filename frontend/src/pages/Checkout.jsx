import React from 'react'
import "../styles/Cart/Checkout.css"
import { Link } from 'react-router-dom'
export default function Checkout() {
    return (
        <div className='checkout'>
            <img src='../../assets/checkout.png'/>
            <Link to="/">
                <button >Quay lại trang chủ</button>
            </Link>
        </div>
    )
}
