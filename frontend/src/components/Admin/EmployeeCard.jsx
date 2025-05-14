import React, {useState} from 'react'

import {useAdminContext} from '../../hooks/useAdminContext'
import {useUserContext} from '../../hooks/useUserContext'

import Confirm from '../Confirm'
import {Button} from "react-bootstrap";

export default function EmployeeCard({employee, handleEdit, hasPermission}) {
    const {admin} = useAdminContext()
    const {dispatch} = useUserContext()
    const [showConfirm, setShowConfirm] = useState(false)

    const handleDelete = async () => {
        if (admin.employee.employee_id === employee.employee_id) {
            console.log('Can not delete employee because it is in used')
            return
        }

        try {
            const response = await fetch('http://localhost/api/employee/' + employee.employee_id, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${admin.token}`
                }
            })

            if (!response.ok) {
                console.error('Failed to delete employee')
                return
            }
            dispatch({type: 'DELETE_EMPLOYEE', payload: employee.employee_id})

        } catch (error) {
            console.error(error)
        }
    }

    const roleClassMap = {
        'Điều hành': 'manager',
        'Admin': 'admin',
        'Bán hàng': 'seller',
        'Quản lí kho': 'stocker',
    }

    return (
        <div className='employee-info'>
            <span>{employee.full_name}</span>
            <span>{employee.email}</span>
            <span>{employee.phone_number}</span>
            <span>{employee.created_at}</span>
            <span
                className={`employee-role-${roleClassMap[employee?.role?.role_name] || ''}`}>{employee?.role?.role_name}</span>
            <span className='employee-action'>
            {hasPermission(admin, 'Nhân viên', 'Sửa') && (
                <Button
                    className={'mx-2'}
                    variant="warning"
                    onClick={() => handleEdit(employee)}
                >
                    <i className='fa-solid fa-pen-to-square m-0'></i>
                </Button>
            )}
                {hasPermission(admin, 'Nhân viên', 'Xóa') && (
                    <Button
                        className={'mx-2'}
                        variant="danger"
                        onClick={() => setShowConfirm(true)}
                    >
                        <i className='fa-solid fa-trash-can m-0'></i>
                    </Button>
                )}
            </span>
            {showConfirm && (
                <Confirm
                    message='Bạn có chắc muốn xóa nhân viên này?'
                    onConfirm={handleDelete}
                    onCancel={() => setShowConfirm(false)}
                />
            )}
        </div>
    )
}
