import React, { useState } from 'react'

import { useUserContext } from '../../hooks/useUserContext'

import Confirm from '../Confirm'

export default function UserCard({ user, handleEdit }) {
    const { dispatch } = useUserContext()
    const [showConfirm, setShowConfirm] = useState(false)

    const handleDelete = async () => {
        try {
            const response = await fetch('http://localhost/api/user/' + user.user_account_id, {
                method: 'DELETE',
                // headers: {
                //     'Authorization': `Bearer ${admin.token}`
                // }
            })
    
            if (!response.ok) {
                console.error('Failed to delete user')
                return
            }
            dispatch({type: 'DELETE_USER', payload: user.user_account_id})

            // remove user from local storage
            localStorage.removeItem('user')
        }
        catch (error) {
            console.error(error)
        }
    }

    return (
        <div className='user-info'>
            <span>{user.full_name}</span>
            <span>{user.email}</span>
            <span>{user.phone_number}</span>
            <span>
                {user.house_number} Đường {user.street} Phường {user.ward} Quận {user.district} Thành phố {user.city}
            </span>
            <span>{user.created_at}</span>
            <span className={user.status === 'Hoạt động' ? 'user-status' : 'user-status-lock'}>{user.status}</span>
            <span className='user-action'>
                <i className='fa-solid fa-pen-to-square' onClick={() => handleEdit(user)}></i>
                <i className='fa-solid fa-trash-can' onClick={() => setShowConfirm(true)}></i>
            </span>
            {showConfirm && (
                <Confirm
                    message='Bạn có chắc muốn xóa tài khoản này?'
                    onConfirm={handleDelete}
                    onCancel={() => setShowConfirm(false)}
                />
            )}
        </div>
    )
}
