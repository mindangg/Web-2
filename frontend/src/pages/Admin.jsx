import React from 'react'

import logo from '../assets/SGU STORE.png'
import '../styles/Admin.css'
import CreateProduct from '../components/CreateProduct'
import DeleteProduct from '../components/DeleteProduct'
import CreateCatalog from '../components/CreateCatalog'

import UserCard from '../components/UserCard'
import OrderCard from '../components/OrderCard'
import ProductCard from '../components/product/ProductCard.jsx'



export default function Admin() {
    return (
        <>
        <div className='header-ad'>
            <div className ="header-logo">
                <img src={logo}></img>
            </div>
            <div>
                Admin
            </div>

        </div>
        <div className ="menu">
            <div>Hệ thống quản trị</div>
            <div><i className="fa-solid fa-user"></i><a>Sản phẩm</a><i className="fa-solid fa-chevron-down"></i></div>
            <div><i className="fa-solid fa-user"></i><a>Danh mục</a><i className="fa-solid fa-chevron-down"></i></div>
            <div><i className="fa-solid fa-user"></i><a>Đơn hàng</a><i className="fa-solid fa-chevron-down"></i></div>
            <div><i className="fa-solid fa-user"></i><a>Khách hàng</a><i className="fa-solid fa-chevron-down"></i></div>  
            {/* <div className = 'createProduct'><CreateProduct/></div> */}
            {/* <div className = 'deleteProduct'><DeleteProduct/></div> */}
            {/* <div className = 'createCatalog'><CreateCatalog/></div> */}
        </div>
        <div className='content'>
            {/* <div className='user-container'>
                <div className='user-header'>
                    <span>Họ tên</span>
                    <span>User name</span>o
                    <span>Email</span>
                    <span>Số điện thoại</span>
                    <span>Địa chỉ</span>
                    <span>Ngày đăng kí</span>
                    <span>Tình trạng</span>
                    <span>Chỉnh sửa</span>
                </div>
                <UserCard/>
                <UserCard/>
                <UserCard/>
            </div> */}
            {/* <div className='order-container'>
                <div className='order-header'>
                    <span>Đơn hàng</span>
                    <span>Khách hàng</span>
                    <span>Ngày đặt</span>
                    <span>Tổng tiền</span>
                    <span>Tình trạng</span>
                    <span>Chi tiết</span>
                </div>
                <OrderCard/>
                <OrderCard/>
                <OrderCard/>
            </div> */}

            {/* <div className='product-container'>
                <div className='product-header'>
                    <span>Image</span>
                    <span>Model</span>
                    <span>Brand</span>
                    <span>Series</span>
                    <span>Base Price</span>
                    <span>Stock</span>
                    <span>Chi tiết</span>
                </div>
                <ProductCard/>
                <ProductCard/>
                <ProductCard/>
            </div> */}
        </div>
        </>

    )
}
