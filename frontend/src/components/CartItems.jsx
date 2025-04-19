import React, { useState, useEffect } from 'react'

import { useAddToCart } from '../hooks/useAddToCart'

import Confirm from '../components/Confirm'

export default function CartItems({ item }) {
    const { handleDelete, handleQuantity } = useAddToCart()
    const [showConfirm, setShowConfirm] = useState(false)

    // useEffect(() => {
    //     console.log(item)
    // })

    return (
        <div className='cart-item'>
            <div className='cart-info'>
                <img 
                    src={`./product/${item.image}`} 
                    alt={item.sku_name}
                    onError={(e) => {
                        e.target.src = '../assets/default-product-image.png'
                    }}
                />
                <div className='cart-details'>
                    <p>{item.sku_name}</p>
                    {/* <p>{item.base_price.toLocaleString()} đ</p> */}
                </div>
            </div>

            <div className='cart-quantity'>
                <button 
                    id='decrease'
                    onClick={item.quantity === 1
                        ? () => setShowConfirm(true)
                        : () => handleQuantity(item, 'decrease')
                      }
                >
                    -
                </button>
                <input 
                    value={item.quantity}
                    type='number'
                    min='1'
                    readOnly
                />
                <button 
                    id='increase'
                    onClick={() => handleQuantity(item, 'increase')}
                >
                    +
                </button>
            </div>

            <div className='cart-total'>
                <p>{item.invoice_price * item.quantity} $</p>
            </div>

            <div className='cart-delete' onClick={() => setShowConfirm(true)}>
                <i className='fa-solid fa-trash-can'></i>
            </div>
            
            {showConfirm && (
                <Confirm
                    message='Bạn có chắc muốn xóa sản phẩm này?'
                    onConfirm={() => handleDelete(item.sku_id)}
                    onCancel={() => setShowConfirm(false)}
                />
            )}
        </div>
    )
}