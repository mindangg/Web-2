import React, { useState, useEffect } from 'react'

import { useSearchParams } from 'react-router-dom'

export default function AdminImportStatistic() {
    const [searchParams, setSearchParams] = useSearchParams()

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-GB')
    }

    const handleRefresh = () => {
        setStartDate('')
        setEndDate('')
        setSortPrice('')
        setSearchParams({})
    }

    useEffect(() => {
        handleRefresh()
    }, [])

    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [sortPrice, setSortPrice] = useState('')
    
    const handleFilter = (startDate, endDate, sortPrice) => {
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

        if (sortPrice !== '') {
            if (sortPrice !== '')
                newParams.set('sortPrice', sortPrice)
        }

        else {
            newParams.delete('sortPrice')
        }

        setSearchParams(newParams)
    }

    return (
        <div className='import-statistic-container'>
            <div className='import-statistic-controller'>
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

                <div className='import-statistic-icon'>
                    <button onClick={() => {
                        handleFilter(startDate, endDate, 'ASC');
                        setSortPrice('ASC')
                    }}>Tăng</button>

                    <button onClick={() => {
                        handleFilter(startDate, endDate, 'DESC');
                        setSortPrice('DESC')
                    }}>Giảm</button>

                    <button onClick={handleRefresh}><i className='fa-solid fa-rotate-right'></i>Refresh</button>
                </div>
            </div>

            <div className='import-statistic-header'>
                <span>Mã SP</span>
                <span>Mã PB</span>
                <span>Tên sản phẩm</span>
                <span>Hình ảnh</span>
                <span>Giá nhập</span>
                <span>Giá bán</span>
                <span>SL đã nhập</span>
                <span>Tổng tiền nhập</span>
            </div>

            <div className='import-statistic-info'>
                <span>Mã SP</span>
                <span>Mã PB</span>
                <span>Tên sản phẩm</span>
                <img alt='hinh anh'></img>
                <span>Giá nhập</span>
                <span>Giá bán</span>
                <span>SL đã nhập</span>
                <span>Tổng tiền nhập</span>
            </div>

            {/* {totalPages > 1 && (<CustomPagination
                currentPage={currentPage}
                totalPage={totalPages}
                searchParams={searchParams}
                setSearchParams={setSearchParams}
            />)} */}

        </div>
    )
}
