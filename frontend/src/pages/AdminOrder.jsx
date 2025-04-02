import React, { useState } from 'react'

import '../styles/Admin.css'

import OrderCard from '../components/Admin/OrderCard'

export default function AdminOrder() {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

    return (
        <div className='order-container'>
            {/* <div className = 'order-controller'>
                <select>
                    <option value='All'>All</option>
                    <option value='Delivered'>Delivered</option>
                    <option value='Pending'>Pending</option>
                    <option value='Canceled'>Canceled</option>
                </select>

                <div className='order-search'>
                    <input type='text' placeholder='Search for...'></input> 
                    <i className='fa-solid fa-magnifying-glass'></i>
                </div>
                
                <label>From</label>

                <input 
                    type='date' 
                    value={startDate || ''}
                />

                <label>To</label>

                <input 
                    type='date' 
                    value={endDate || ''} 
                />

                <div className='order-icon'>
                    <button><i className='fa-solid fa-rotate-right'></i>Refresh</button>
                </div>
            </div> */}
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
        </div>
    )
}
