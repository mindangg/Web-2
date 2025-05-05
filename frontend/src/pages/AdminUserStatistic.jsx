import React, { useState, useEffect } from 'react'

import { useSearchParams } from 'react-router-dom'

import { useAdminContext } from '../hooks/useAdminContext'
import { useNotificationContext } from '../hooks/useNotificationContext'

export default function AdminUserStatistic() {
    const { admin } = useAdminContext()
    const { showNotification } = useNotificationContext()

    const [user, setUser] = useState([])

    const [searchParams, setSearchParams] = useSearchParams()
    
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-GB')
    }

    const fetchTop5Users = async () => {
        try {
            const url = searchParams.toString()
            ? `http://localhost/api/statistic/user?${searchParams}`
            : `http://localhost/api/statistic/user`
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${admin.token}`
                }
            })
            if (!response.ok)
                return console.error('Error fetching top 5 users:', response.status)
            
            const json = await response.json()
            console.log(json)

            setUser(json)
        }
        catch (error) {
            console.error('Error fetching top 5 users:', error)
        }
    }

    useEffect(() => {
        fetchTop5Users()
    }, [searchParams])

    const handleRefresh = () => {
        setStartDate('')
        setEndDate('')
        setSearchParams({})
    }

    useEffect(() => {
        handleRefresh()
    }, [])

    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    
    const handleFilter = (startDate, endDate) => {
        if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
            showNotification('Ngày kết thúc không được nhỏ hơn ngày bắt đầu')
            return
        }

        const newParams = new URLSearchParams(searchParams)

        if (startDate !== '' || endDate !== '') {
            if (startDate !== '')
                newParams.set('startDate', startDate)

            if (endDate !== '') 
                newParams.set('endDate', endDate)
        }

        else {
            newParams.delete('startDate')
            newParams.delete('endDate')
        }

        setSearchParams(newParams)
    }
 
    return (
        <div className='user-statistic-container'>
            <div className='user-statistic-controller'>
            <label>Từ ngày</label>

            <input 
                type='date' 
                value={startDate || ''}
                onChange={(e) => {
                    handleFilter(e.target.value, '');
                    setStartDate(e.target.value)}}/>

            <label>Đến ngày</label>

            <input 
                type='date' 
                value={endDate || ''}
                min={startDate || undefined} 
                onChange={(e) => {
                    handleFilter('', e.target.value);
                    setEndDate(e.target.value)}}/>

                <div className='user-statistic-icon'>
                    <button onClick={handleRefresh}><i className='fa-solid fa-rotate-right'></i>Refresh</button>
                </div>
            </div>
            
            <h1 style={{ textAlign: 'center', margin: '10px 0' }}>Top 5 khách hàng mua nhiều nhất</h1>
            <div className='user-statistic-header'>
                <span>Họ tên</span>
                <span>Email</span>
                <span>Số điện thoại</span>
                <span>Địa chỉ</span>
                <span>Ngày đăng kí</span>
                <span>Tình trạng</span>
                <span>Đơn hàng</span>
            </div>

            {user && user.map((u) => (
                <div className='user-statistic-info'>
                    <span>{u.full_name}</span>
                    <span>{u.email}</span>
                    <span>{u.phone_number}</span>
                    <span>
                        {user.house_number} Đường {user.street} Phường {user.ward} Quận {user.district} Thành phố {user.city}
                    </span>
                    <span>{user.created_at}</span>
                    <span className={user.status === 'Hoạt động' ? 'user-status' : 'user-status-lock'}>{user.status}</span>
                    <span className='order-action'>
                        <i className="fa-solid fa-eye"></i>
                        Chi tiết
                    </span>
                </div>
            ))}
        </div>
    )
}
