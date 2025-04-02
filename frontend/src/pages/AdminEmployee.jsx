import React, { useState } from 'react'

import '../styles/Admin.css'

import EmployeeCard from '../components/Admin/EmployeeCard'

export default function AdminEmployee() {
    const [isToggle, setIsToggle] = useState(false)

    const toggle = () => {
        setIsToggle(!isToggle)
    }

    return (
        <div className='employee-container'>
            {/* <div className = 'employee-controller'>
                <select onChange={(e) => filterEmployee(e.target.value)}>
                    <option value='All'>All</option>
                    <option value='Admin'>Admin</option>
                    <option value='Seller'>Seller</option>
                    <option value='Stocker'>Stocker</option>
                </select>

                <div className='employee-search'>
                    <input type='text' placeholder='Search for...'></input> 
                    <i className='fa-solid fa-magnifying-glass'></i>
                </div>
                
                <label>From</label>

                <input type='date'></input>

                <label>To</label>

                <input type='date'></input>

                <div className='employee-icon'>
                    <button><i className='fa-solid fa-rotate-right'></i>Refresh</button>
                    <button onClick={toggle}><i className='fa-solid fa-plus'></i>Add</button>
                </div>
            </div> */}
            <div className='employee-header'>
                <span>Họ tên</span>
                <span>Số điện thoại</span>
                <span>Ngày thêm</span>
                <span>Vai trò</span>
                <span>Chỉnh sửa</span>
            </div>
            <EmployeeCard/>
            <EmployeeCard/>
            <EmployeeCard/>
        </div>
    )
}
