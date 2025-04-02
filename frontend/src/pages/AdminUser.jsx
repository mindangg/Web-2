import React from 'react'

import UserCard from '../components/Admin/UserCard'

import '../styles/Admin.css'

export default function AdminUser() {
  return (
    <div className='user-container'>
        <div className='user-header'>
            <span>Họ tên</span>
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
    </div>
  )
}
