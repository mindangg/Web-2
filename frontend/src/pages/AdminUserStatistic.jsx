import React, { useState, useEffect } from 'react'
import {PRODUCT_IMAGE_PATH} from "../utils/Constant";
import { useSearchParams } from 'react-router-dom'

import { useAdminContext } from '../hooks/useAdminContext'
import { useNotificationContext } from '../hooks/useNotificationContext'

export default function AdminUserStatistic() {
    const { admin } = useAdminContext()
    const { showNotification } = useNotificationContext()

    const [user, setUser] = useState([])
    const [order, setOrder] = useState([])
    const [details, setDetails] = useState([])
    const [isToggleOrder, setIsToggleOrder] = useState(false)
    const [isToggleDetails, setIsToggleDetails] = useState(false)

    const [searchParams, setSearchParams] = useSearchParams()

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
            // console.log(json[0].receipts[0].details)

            setUser(json)
        }
        catch (error) {
            console.error('Error fetching top 5 users:', error)
        }
    }

    const isToggle = (o) => {
        setOrder(o)
        setIsToggleOrder(!isToggleOrder)
    }

    const isToggleOrderDetails = (d) => {
        // console.log(d)
        setDetails(d)
        setIsToggleDetails(!isToggleDetails)
    }

    useEffect(() => {
        fetchTop5Users()
    }, [searchParams])

    const handleRefresh = () => {
        setStartDate('')
        setEndDate('')
        setSortOrder('')
        setSearchParams({})
    }

    useEffect(() => {
        handleRefresh()
    }, [])

    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [sortOrder, setSortOrder] = useState('')
    
    const handleFilter = (startDate, endDate, sortOrder) => {
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

        if (sortOrder !== '') {
            if (sortOrder !== '')
                newParams.set('sortOrder', sortOrder)
        }

        else {
            newParams.delete('sortOrder')
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
                    handleFilter(e.target.value, endDate, sortOrder);
                    setStartDate(e.target.value)}}/>

            <label>Đến ngày</label>

            <input 
                type='date' 
                value={endDate || ''}
                min={startDate || undefined} 
                onChange={(e) => {
                    handleFilter(startDate, e.target.value, sortOrder);
                    setEndDate(e.target.value)}}/>

                <div className='user-statistic-icon'>
                    <button onClick={() => {
                        handleFilter(startDate, endDate, 'ASC');
                        setSortOrder('ASC')
                    }}>Tăng</button>

                    <button onClick={() => {
                        handleFilter(startDate, endDate, 'DESC');
                        setSortOrder('DESC')
                    }}>Giảm</button>

                    <button onClick={handleRefresh}><i className='fa-solid fa-rotate-right'></i>Refresh</button>
                </div>
            </div>
            
            <h1 style={{ textAlign: 'center', margin: '10px 0' }}>Top 5 khách hàng mua nhiều nhất</h1>
            <div className='user-statistic-header'>
                <span>Họ tên</span>
                <span>Email</span>
                <span>Số điện thoại</span>
                <span>Địa chỉ</span>
                <span>Tình trạng</span>
                <span>Tổng tiền mua</span>
                <span>Đơn hàng</span>
            </div>

            {user && user.map(u => (
                <div className='user-statistic-info'>
                    <span>{u.full_name}</span>
                    <span>{u.email}</span>
                    <span>{u.phone_number}</span>
                    <span>
                        {u.house_number} Đường {u.street} Phường {u.ward} Quận {u.district} Thành phố {u.city}
                    </span>
                    <span className={u.status === 'Hoạt động' ? 'user-status' : 'user-status-lock'}>{u.status}</span>
                    <span>{new Intl.NumberFormat('vi-VN').format(u.total_spent)} VND</span>
                    <span className='user-statistic-action' onClick={() => isToggle(u.receipts)}>
                        <i className='fa-solid fa-eye'></i>
                        Xem
                    </span>
                </div>
            ))}

            {isToggleOrder && (
                <div className='user-order-container'>
                    <div className='user-order'>
                        <i className='fa-solid fa-xmark' id='user-order-close' onClick={() => setIsToggleOrder(!isToggleOrder)}></i>
                        <div className='user-order-header'>
                            <span>Đơn hàng</span>
                            <span>Ngày đặt</span>
                            <span>Tổng tiền</span>
                            <span>Phương thức thanh toán</span>
                            <span>Tình trạng</span>
                            <span>Chi tiết</span>
                        </div>

                        {order && order.map(o => (
                            <>
                            <div className='user-order-info'>
                                <span>DH{o.receipt_id}</span>
                                <span>{o.created_at}</span>
                                <span>{new Intl.NumberFormat('vi-VN').format(o.total_price)} VND</span>
                                <span>{o.payment_method}</span>
                                <span className='user-order-status-pending'>{o.status}</span>
                                <span className='user-order-action' onClick={() => {isToggleOrderDetails(o.details); console.log(o.details)}}>
                                    <i className="fa-solid fa-eye"></i>
                                    Chi tiết
                                </span>
                            </div>
                            {isToggleDetails && (
                                <div className='user-details-container'>
                                    <div className='user-details'>
                                        <i className='fa-solid fa-xmark' id='user-details-close' onClick={() => setIsToggleDetails(!isToggleDetails)}></i>
                                        <h2>Chi tiết hóa đơn</h2>
                                        <h4 style={{marginBottom: '10px'}}>Đơn số: DH{o.receipt_id}</h4>
                                        <div style={{marginBottom: '10px'}}>Ngày tạo: {o.created_at}</div>
                                        <div style={{fontWeight: 'bold'}}>Sản phẩm: </div>
                                        {details && details.map(d => (
                                            <div className='user-details-item'>
                                                <div>
                                                    <img src={`${PRODUCT_IMAGE_PATH}${d.sku_image}`} alt="Product Image" />
                                                </div>
                                                <div>
                                                    <div>{d.sku_name} {d.ram}/{d.storage}</div>
                                                    <div>Màu: {d.color}</div>
                                                </div>
                                                <div>
                                                    <div>Giá: {new Intl.NumberFormat('vi-VN').format(d.price)} VND</div>
                                                    <div>Số lượng: {d.quantity}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            </>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
