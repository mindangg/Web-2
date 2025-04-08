import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Cart.css';
import CartItems from '../components/CartItems';
import { useCartContext } from '../contexts/useCartContext';

export default function Cart() {
    const { cart } = useCartContext();
    
    // Tính tổng tiền
    const totalAmount = cart.reduce((sum, item) => sum + (item.base_price * item.quantity), 0);

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
                    {cart.length > 0 ? (
                        cart.map(item => (
                            <CartItems key={item.product_id } item={item} />
                        ))
                    ) : (
                        <p className="empty-cart">Giỏ hàng trống</p>
                    )}
                </div>
            </div>
            
            <div className='cart-controller'>
                <Link to='/'><button><i className="fa-solid fa-reply"></i>Tiếp tục mua hàng</button></Link>

                {cart.length > 0 && (
                    <div className='cart-summary'>
                        <h3>Tổng tiền: {totalAmount.toLocaleString()} đ</h3>
                        <Link to='/payment'>
                            <button id='checkout-btn'>Thanh Toán</button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}