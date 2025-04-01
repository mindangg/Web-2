import React, { useState } from 'react';
import ip12 from '../assets/iphone-12-pro-blue-hero.png';

import '../styles/CartItems.css';

export default function CartItems() {
    const [quantity, setQuantity] = useState(1)
    const handleDelete = () => {
        alert("Bạn muốn xóa sản phẩm này ?")
      };

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
                <button id='decrease'
                        onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                        disabled={quantity === 1}>-</button>
                <input 
                    value={quantity}
                    type='number'
                    min="1"
                    onChange={(e) => {
                        const value = parseInt(e.target.value) || 1;
                        setQuantity(Math.max(1,value));
                    }}
                    />
                <button id='increase'
                        onClick={() => setQuantity((next) => next + 1)}
                        >+</button>
            </div>
            <div className='cart-total'>
                <p>30.000.000 đ</p>
            </div>

            <div className='cart-delete' onClick={() => handleDelete()}>
                <i className="fa-solid fa-trash-can" ></i>
            </div>
        </div>
    )
}
