import React from 'react'

import testCover from '../../assets/iphone-12-pro-blue-hero.png'

export default function ProductCard() {
    return (
        <div className='product-info'>
            <span>
                <img src={testCover}></img>
            </span>
            <span>My Dress Up Darling - Volume 01</span>
            <span>My Dress Up Darling - Volume 01</span>
            <span>Rom Com</span>
            <span>20.000.000đ</span>
            <span>150</span>
            <span>  </span>
            <span className='product-action'>
                <i className='fa-solid fa-pen-to-square'></i>
                <i className='fa-solid fa-trash-can'></i>
            </span>
        </div>
    )
}
