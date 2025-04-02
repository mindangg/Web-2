import React from 'react'

import '../../styles/Admin.css'

export default function EmployeeCard() {
    return (
        <div className='employee-info'>
            <span>Tran Minh Dang</span>
            <span>0901234567</span>
            <span>19/05/2005</span>
            {/* <span className={`employee-status-${employee.role}`}>{employee.role}</span> */}
            <span className={`employee-status-Admin`}>Admin</span>
            <span className='employee-action'>
                <i className='fa-solid fa-pen-to-square'></i>
                <i className='fa-solid fa-trash-can'></i>
            </span>
        </div>
    )
}
