import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/Cart.css'
import CartItems from '../components/CartItems'
import { useAuthContext } from '../hooks/useAuthContext'
import { useCartContext } from '../hooks/useCartContext'

import empty from '../assets/cart-empty.jpg'

export default function Cart() {
    const { user } = useAuthContext()
    const { cart, dispatch } = useCartContext()
    
    useEffect(() => {
        if (user?.user?.user_account_id) {
            const exists = JSON.parse(localStorage.getItem(`cart_${user.user.user_account_id}`)) || []

            dispatch({ type: 'DISPLAY_ITEM', payload: exists})
        }
    }, [user, dispatch])

    return cart && cart.length > 0 ? (
        <div className='cart'>
            <h2>Chi tiết giỏ hàng</h2>
            <div className='cart-display'>
                <div className='cart-desc'>
                    <h3>Sản phẩm</h3>
                    <h3>Số lượng</h3>
                    <h3>Tổng</h3>
                    <h3></h3>
                </div>

                <div className='cart-items'>
                    {cart.map(item => (
                        <CartItems key={item.sku_id} item={item} />
                    ))}
                </div>
            </div>
            
            <div className='cart-controller'>
                <Link to='/'><button><i className='fa-solid fa-reply'></i>Tiếp tục mua hàng</button></Link>

                {cart && cart.length > 0 && (
                    <div className='cart-summary'>
                        <h3>Tổng tiền: {(cart.reduce((sum, item) => sum + (item.invoice_price * item.quantity), 0)).toLocaleString('vi')}đ</h3>
                        <Link to='/payment'>
                            <button id='checkout-btn'>Thanh Toán</button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    ) : (
        <div className='cart-empty'>
            <h2>Giỏ hàng trống</h2>
            <img src={empty} alt='Empty Cart'></img>
            <Link to='/'><button><i className='fa-solid fa-reply'></i>Quay lại trang chủ</button></Link>
        </div>
    )
}