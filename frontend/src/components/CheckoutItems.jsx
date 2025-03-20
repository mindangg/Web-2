import React from 'react'

import test from '../assets/iphone-12-pro-blue-hero.png'

import '../styles/Checkout.css'

export default function CheckoutItems() {
    return (
        <div className='checkout-item'>
            <img src={test}></img>
            <span>iPhone 12 Pro Max</span>
            <span>1</span>
            <span>30.000.000 đ</span>
    </div>
    )
}
