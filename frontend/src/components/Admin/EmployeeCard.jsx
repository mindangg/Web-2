import React from 'react'

import { useAdminContext } from '../../hooks/useAdminContext'
import { useUserContext } from '../../hooks/useUserContext'

export default function EmployeeCard({ employee, handleEdit }) {
    const { admin } = useAdminContext()
    const { dispatch } = useUserContext()

    const handleDelete = async () => {
        if (admin.employee.employee_id === employee.employee_id) {
            console.log('Can not delete employee because it is in used')
            return
        }
        
        try {
            const response = await fetch('http://localhost/api/employee/' + employee.employee_id, {
                method: 'DELETE',
                // headers: {
                //     'Authorization': `Bearer ${admin.token}`
                // }
            })
    
            if (!response.ok) {
                console.error('Failed to delete employee')
                return
            }
            dispatch({type: 'DELETE_EMPLOYEE', payload: employee.employee_id})

            // remove user from local storage
            localStorage.removeItem('employee')
        }
        catch (error) {
            console.error(error)
        }
    }

    const roleClassMap = {
        'Điều hành': 'manager',
        'Admin': 'admin',
        'Bán hàng': 'seller',
        'Quản lí kho': 'stocker',
      };
    
    return (
        <div className='employee-info'>
            <span>{employee.full_name}</span>
            <span>{employee.email}</span>
            <span>{employee.phone_number}</span>
            <span>{employee.created_at}</span>
            <span className={`employee-role-${roleClassMap[employee.role_name] || 'default'}`}>{employee.role_name}</span>
            <span className='employee-action'>
                <i className='fa-solid fa-pen-to-square' onClick={() => handleEdit(employee)}></i>
                <i className='fa-solid fa-trash-can' onClick={handleDelete}></i>
            </span>
        </div>
    )
}
