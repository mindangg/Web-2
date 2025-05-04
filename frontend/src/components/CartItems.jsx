import React, { useState, useEffect } from 'react'

import { useAddToCart } from '../hooks/useAddToCart'
import { useNotificationContext } from '../hooks/useNotificationContext'

import Confirm from '../components/Confirm'

export default function CartItems({ item }) {
    const { handleDelete, handleQuantity } = useAddToCart()
    const { showNotification } = useNotificationContext()
    const [showConfirm, setShowConfirm] = useState(false)

    const [pendingQuantity, setPendingQuantity] = useState(null)
    const [inputValue, setInputValue] = useState(item.quantity)

    const handleInputChange = (value) => {
        // Numbers
        if (!/^\d*$/.test(value)) 
            return

        const newQuantity = parseInt(value, 10)

        if (isNaN(newQuantity)) {
            setInputValue('')
            return
        }

        if (newQuantity === 0) {
            setInputValue(0)
            setPendingQuantity(0)
            setShowConfirm(true)
        } 

        else if (newQuantity > item.stock) {
            showNotification('Sản phẩm hết hàng')
            setInputValue(item.stock)
        }

        else {
            setInputValue(newQuantity)
            handleQuantity(item, 'set', newQuantity)
        }
    }
    
    const confirmDelete = () => {
        handleDelete(item.sku_id)
        setShowConfirm(false)
        setPendingQuantity(null)
    }

    const cancelDelete = () => {
        setShowConfirm(false)
        setPendingQuantity(null)
        setInputValue(item.quantity)
    }

    useEffect(() => {
        setInputValue(item.quantity)
    }, [item.quantity])

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
                    value={inputValue}
                    type='number'
                    onChange={(e) => handleInputChange(e.target.value)}
                />
                <button 
                    id='increase'
                    onClick={() => handleQuantity(item, 'increase')}
                >
                    +
                </button>
            </div>

            <div className='cart-total'>
                <p>{(item.invoice_price * item.quantity).toLocaleString('vi-VN')}đ</p>
            </div>

            <div className='cart-delete' onClick={() => setShowConfirm(true)}>
                <i className='fa-solid fa-trash-can'></i>
            </div>
            
            {showConfirm && (
                <Confirm
                    message='Bạn có chắc muốn xóa sản phẩm này?'
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
            )}
        </div>
    )
}