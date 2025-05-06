import React, { useState, useEffect } from 'react'

import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend)

import { useSearchParams } from 'react-router-dom'

import { useAdminContext } from '../hooks/useAdminContext'
import { useNotificationContext } from '../hooks/useNotificationContext'

export default function AdminOrderStatistic() {
    const { admin } = useAdminContext()
    const { showNotification } = useNotificationContext()

    const [stats, setStats] = useState()
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: []
    })

    const [searchParams, setSearchParams] = useSearchParams()

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-GB')
    }

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom'
            },
            title: {
                display: true,
                text: 'Thống Kê Đơn Hàng'
            }
        }
    } 

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

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const url = searchParams.toString()
                ? `http://localhost/api/statistic/order?${searchParams}`
                : `http://localhost/api/statistic/order`
                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${admin.token}`
                    }
                })
                if (!response.ok)
                    return console.error('Error fetching order statistic:', response.status)
                
                const json = await response.json()
                console.log(json)
    
                setStats(json)
                const labels = json.map(stat => formatDate(new Date(stat.date)))                  
                const salesData = json.map(stat => stat.total_products_sold)
                const revenueData = json.map(stat => stat.total_revenue)
                const profitData = json.map(stat => stat.total_profit)

                setChartData({
                    // labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                    labels,
                    datasets: [
                        {
                            label: 'Số Lượng Đã Bán',
                            data: salesData,
                            borderColor: '#e69e19',
                            backgroundColor: '#e69e19',
                            tension: 0.4,
                            pointRadius: 4,
                            pointHoverRadius: 6,
                            borderWidth: 2,
                            fill: false
                        },
                        {
                            label: 'Tổng Doanh Thu (VNĐ)',
                            data: revenueData,
                            borderColor: '#28ac64',
                            backgroundColor: '#28ac64',
                            tension: 0.4,
                            pointRadius: 4,
                            pointHoverRadius: 6,
                            borderWidth: 2,
                            fill: false
                        },
                        {
                            label: 'Tổng Lợi Nhuận (VNĐ)',
                            data: profitData,
                            borderColor: '#f84c2c',
                            backgroundColor: '#f84c2c',
                            tension: 0.4,
                            pointRadius: 4,
                            pointHoverRadius: 6,
                            borderWidth: 2,
                            fill: false
                        }
                    ]
                })
            }
            catch (error) {
                console.error('Error fetching stats:', error)
            }
        }

        fetchStats()
    }, [searchParams])

    return (
        <div className='order-statistic-container'>
            <div className='order-statistic-controller'>
                <label>Từ ngày</label>

                <input 
                    type='date' 
                    value={startDate || ''}
                    onChange={(e) => {
                        handleFilter(e.target.value, endDate)
                        setStartDate(e.target.value)}}/>

                <label>Đến ngày</label>

                <input 
                    type='date' 
                    value={endDate || ''} 
                    min={startDate || undefined}
                    onChange={(e) => {
                        handleFilter(startDate, e.target.value)
                        setEndDate(e.target.value)}}/>

                <div className='order-statistic-icon'>
                    <button onClick={handleRefresh}><i className='fa-solid fa-rotate-right'></i>Refresh</button>
                </div>
            </div>

            <div className='order-statistic-items'>
                <div className='order-statistic-item'>
                    <div className='order-statistic-item-content'>
                        <p>Số Lượng Đã Bán</p>
                        <h4>
                        {stats 
                            ? stats.reduce((total, i) => total + (parseFloat(i.total_products_sold) || 0), 0).toLocaleString('vi-VN') 
                            : '0'}
                        </h4>
                    </div>
                    <div className='order-statistic-item-icon'>
                        <i className='fa-solid fa-mobile-screen'></i>
                    </div>
                </div>
                <div className='order-statistic-item'>
                    <div className='order-statistic-item-content'>
                        <p>Tổng Doanh Thu</p>
                        <h4>
                        {stats 
                            ? stats.reduce((total, i) => total + (parseFloat(i.total_revenue) || 0), 0).toLocaleString('vi-VN') + ' ₫' 
                            : '0 ₫'}
                        </h4>
                    </div>
                    <div className='order-statistic-item-icon'>
                        <i className='fa-solid fa-file-lines'></i>
                    </div>
                </div>
                <div className='order-statistic-item'>
                    <div className='order-statistic-item-content'>
                        <p>Tổng Lợi Nhuận</p>
                        <h4>
                        {stats 
                            ? stats.reduce((total, i) => total + (parseFloat(i.total_profit) || 0), 0).toLocaleString('vi-VN') + ' ₫' 
                            : '0 ₫'}
                        </h4>
                    </div>
                    <div className='order-statistic-item-icon'>
                        <i className='fa-solid fa-dollar-sign'></i>
                    </div>
                </div>
            </div>

            <div className='order-statistic-chart'>
                {chartData 
                ? (
                    <Line
                    data={chartData} 
                    options={chartOptions}
                    />
                )
                : (
                    <p className='loading-message'>Loading chart data...</p>
                )}
            </div>
        </div>
    )
}
