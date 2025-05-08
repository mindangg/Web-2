import React, { useEffect, useState } from 'react'

import '../styles/Admin.css'

import OrderCard from '../components/Admin/OrderCard'

import CustomPagination from '../components/CustomPagination.jsx'

import { useAdminContext } from '../hooks/useAdminContext.jsx'

export default function AdminOrder() {
    const { admin } = useAdminContext() 

    const [order, setOrder] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPage, setTotalPage] = useState(0)

    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    const fetchOrder = async () => {
        const response = await fetch('http://localhost/api/receipt', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${admin.token}`
            }
        })

        if (!response.ok) {
            throw new Error('Failed to fetch order')
        }
  
        const json = await response.json()
        setOrder(json.totalOrders)
        setCurrentPage(json.currentPage)
        setTotalPage(json.totalPage)
    }

    useEffect(() => {
        fetchOrder()
    })

    return (
        <div className='order-container'>
            <div className = 'order-controller'>
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
            </div>
            <div className='order-header'>
                <span>Đơn hàng</span>
                <span>Khách hàng</span>
                <span>Ngày đặt</span>
                <span>Tổng tiền</span>
                <span>Tình trạng</span>
                <span>Chi tiết</span>
            </div>
            {/* <OrderCard/>
            <OrderCard/>
            <OrderCard/> */}
            {order?.map(o => (
                <OrderCard order={o} />
            ))}
        </div>
    )
}
