import React from 'react';
import { Link } from 'react-router-dom';

import '../styles/Cart.css';
import CartItems from '../components/CartItems';

export default function Cart() {
    return (
        <div className='cart'>
            <h2>Chi tiết giỏ hàng</h2>
            <div className='cart-display'>
                <div className='cart-desc'>
                    <h3>Sản phẩm</h3>
                    <h3>Số lượng</h3>
                    <h3>Tổng</h3>
                </div>

                <div className='cart-items'>
                    <CartItems/>
                    <CartItems/>
                    <CartItems/>
                </div>
            </div>
            
            <div className='cart-controller'>
                <button><i className="fa-solid fa-reply"></i>Tiếp tục mua hàng</button>

                <div className='cart-summary'>
                    <h3>Tổng tiền: 30.000.000 đ</h3>
                    <Link to='/checkout'>
                    <button id='checkout-btn'>Thanh Toán</button>
                </Link>
                </div>
            </div>
        </div>
    )
}
