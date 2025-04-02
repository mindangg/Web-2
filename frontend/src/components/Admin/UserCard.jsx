import React from 'react'

import '../../styles/Admin.css'

export default function UserCard() {
    return (
        <div className='user-info'>
            <span>Trần Minh Đăng</span>
            <span>mindang@gmail.com</span>
            <span>0901234567</span>
            <span>105 Ba Huyen Thanh Quan, Vo Thi Sau, 3, TP.HCM</span>
            <span>19/05/2005</span>
            <span className='user-status'>Hoạt động</span>
            <span className='user-action'>
                <i className='fa-solid fa-pen-to-square'></i>
                <i className='fa-solid fa-trash-can'></i>
            </span>
        </div>
    )
}
