import React from 'react'

import ip12 from '../assets/iphone-12-pro-blue-hero.png'

import '../styles/Card.css'

export default function Card({ phone }) {
    return (
        <div className='card'>
            <img src={ip12}></img>
            <h3>iPhone 12 Pro Max</h3>
            <p>20.000.000 đ</p>

            <div className='card-btns'>
                <button><i className="fa-solid fa-magnifying-glass-plus"></i></button>
                <button>Thêm vào <i className="fa-solid fa-cart-shopping"></i></button>
            </div>
        </div>
    )
}
