import React from 'react';
import '../styles/CartItems.css';
import { useCartContext } from '../contexts/useCartContext';
import { useAddToCart } from '../hooks/useAddToCart';
import { useAuthContext } from '../hooks/useAuthContext';

export default function CartItems({ item }) {
    const { updateCart } = useCartContext();
    const { deleteCart, handleQuantity } = useAddToCart();
    const { user } = useAuthContext();

    const handleDelete = () => {
        if (window.confirm("Bạn muốn xóa sản phẩm này?")) {
            const userId = user.user.user_account_id;
            deleteCart( item.product_id );
            // Cập nhật lại giỏ hàng sau khi xóa
            // const updatedCart = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
            // updateCart(updatedCart);
        }
    };

    const handleQuantityChange = (type) => {
        const userId = user.user.user_account_id
        handleQuantity(item, type);
        // Cập nhật lại giỏ hàng sau khi thay đổi số lượng
        // const updatedCart = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
        // updateCart(updatedCart);
    };

    return (
        <div className='cart-item'>
            <div className='cart-info'>
                <img 
                    src={`./product/${item.image}`} 
                    alt={item.name}
                    onError={(e) => {
                        e.target.src = '../assets/default-product-image.png';
                    }}
                />
                <div className="cart-details">
                    <p>{item.name}</p>
                    <p>{item.base_price.toLocaleString()} đ</p>
                </div>
            </div>
            <div className='cart-quantity'>
                <button 
                    id='decrease'
                    onClick={() => handleQuantityChange('decrease')}
                    disabled={item.quantity === 1}
                >
                    -
                </button>
                <input 
                    value={item.quantity}
                    type='number'
                    min="1"
                    readOnly
                />
                <button 
                    id='increase'
                    onClick={() => handleQuantityChange('increase')}
                >
                    +
                </button>
            </div>
            <div className='cart-total'>
                <p>{(item.base_price * item.quantity).toLocaleString()} đ</p>
            </div>
            <div className='cart-delete' onClick={handleDelete}>
                <i className="fa-solid fa-trash-can"></i>
            </div>
        </div>
    )
}