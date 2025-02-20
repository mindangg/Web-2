import React from 'react';
import ip12 from '../assets/iphone-12-pro-blue-hero.png';

import '../styles/CartItems.css';

export default function CartItems() {
    return (
        <div className='cart-item'>
            <div className='cart-info'>
                <img src={ip12} alt="iPhone 12 Pro Max"/>
                <div className="cart-details">
                    <p>iPhone 12 Pro Max (256GB) | Chính hãng VN/A - Xanh Dương</p>
                    <p>12.000.000 đ</p>
                </div>
            </div>
            <div className='cart-quantity'>
                <button id='decrease'>-</button>
                <input value={10}/>
                <button id='increase'>+</button>
            </div>
            <div className='cart-total'>
                <p>30.000.000 đ</p>
            </div>

            <div className='cart-delete'>
                <i className="fa-solid fa-trash-can"></i>
            </div>
        </div>
    )
}
