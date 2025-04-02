import React, { useState, useEffect } from 'react'

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function AdminOrderStatistic() {
    const [stats, setStats] = useState()
    const [chartData, setChartData] = useState(true)

    return (
        <div className='order-statistic-container'>

            <div className='order-statistic-items'>
                <div className='order-statistic-item'>
                    <div className='order-statistic-item-content'>
                        <p>Quantity Sold</p>
                        {/* <h4>{stats && stats.reduce((total, i) => total + i.totalSales || 0, 0)}</h4> */}
                        <h4>50</h4>
                    </div>
                    <div className='order-statistic-item-icon'>
                        <i className='fa-solid fa-mobile-screen'></i>
                    </div>
                </div>
                <div className='order-statistic-item'>
                    <div className='order-statistic-item-content'>
                        <p>Total Revenue</p>
                        {/* <h4>$ {stats && stats.reduce((total, i) => total + i.totalRevenue || 0, 0).toFixed(2)}</h4> */}
                        <h4>$ 5000</h4>
                    </div>
                    <div className='order-statistic-item-icon'>
                        <i class='fa-solid fa-file-lines'></i>
                    </div>
                </div>
                <div className='order-statistic-item'>
                    <div className='order-statistic-item-content'>
                        <p>Total Profit</p>
                        {/* <h4>$ {stats && stats.reduce((total, i) => total + i.totalProfit || 0, 0).toFixed(2)}</h4> */}
                        <h4>$ 1000</h4>
                    </div>
                    <div className='order-statistic-item-icon'>
                        <i className='fa-solid fa-dollar-sign'></i>
                    </div>
                </div>
            </div>

            <div className='order-statistic-chart'>
                {chartData 
                ? (
                    // <Bar data={chartData} />
                    <Bar
                    data={{
                        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                        datasets: [
                            {
                                label: 'Total Sales',
                                data: [10,20,30],
                                backgroundColor: '#e69e19'
                            },
                            {
                                label: 'Total Revenue ($)',
                                data: [300,200,400],
                                backgroundColor: '#28ac64',
                            },
                            {
                                label: 'Total Profit ($)',
                                data: [100,120,150],
                                backgroundColor: '#f84c2c',
                            }
                        ]
                    }}
                    />
                )
                : (
                    <p className='loading-message'>Loading chart data...</p>
                )}
            </div>
        </div>
    )
}
