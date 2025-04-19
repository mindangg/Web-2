import React from 'react'

import test from '../assets/iphone-12-pro-blue-hero.png'

import '../styles/Checkout.css'

export default function CheckoutItems({ cart }) {
    return (
        <div className='checkout-item'>
            <img 
                src={`./product/${cart.image}`} 
                alt={cart.sku_name}
                onError={(e) => {
                    e.target.src = '../assets/default-product-image.png'
                }}
            />
            <span>{cart.sku_name}</span>
            <span>{cart.quantity}</span>
            <span>{cart.invoice_price} $</span>
    </div>
    )
}
