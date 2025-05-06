import React from 'react'

import '../../styles/Admin.css'

export default function OrderCard({ order }) {
    return (
        <div className='order-info'>
            <span>Đơn hàng: {order.receipt_id}</span>
            <span>mindang@gmail.com</span>
            <span>{order.created_at}</span>
            <span>30.000.000đ</span>
            <span className='order-status-pending'>Chờ xử lí</span>
            <span className='order-action'>
                <i className="fa-solid fa-eye"></i>
                Chi tiết
            </span>
            {/* <span>1</span>
            <span>mindang@gmail.com</span>
            <span>19/05/2005</span>
            <span>30.000.000đ</span>
            <span className='order-status-pending'>Chờ xử lí</span>
            <span className='order-action'>
                <i className="fa-solid fa-eye"></i>
                Chi tiết
            </span> */}
        </div>
    )
}
