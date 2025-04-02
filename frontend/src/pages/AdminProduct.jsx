import React from 'react'

import '../styles/Admin.css'

import ProductCard from '../components/Admin/ProductCard.jsx'

export default function AdminProduct() {
    return (
      <div className='product-container'>
          <div className='product-header'>
              <span>Image</span>
              <span>Model</span>
              <span>Brand</span>
              <span>Series</span>
              <span>Base Price</span>
              <span>Stock</span>
              <span>Chỉnh sửa</span>
          </div>
          <ProductCard/>
          <ProductCard/>
          <ProductCard/>
      </div>
    )
}
