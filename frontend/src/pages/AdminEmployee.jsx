import React, { useState, useEffect } from 'react'

import EmployeeCard from '../components/Admin/EmployeeCard'

import { useAdminContext } from '../hooks/useAdminContext'
import { useUserContext } from '../hooks/useUserContext'

import { useNotificationContext } from '../hooks/useNotificationContext'

import Pagination from '../components/Pagination.jsx';

import { useSearchParams } from 'react-router-dom';

export default function AdminEmployee() {
    const { admin } = useAdminContext()
    const { users, dispatch } = useUserContext()
    const { showNotification } = useNotificationContext()

    const [currentPage, setCurrentPage] = useState(1)
    const [totalPage, setTotalPage] = useState(0)
    const [currentUsers, setCurrentUsers] = useState([])
    const [searchParams, setSearchParams] = useSearchParams(`limit=10`)

    const [full_name, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [phone_number, setPhoneNumber] = useState('')
    const [role, setRole] = useState(0)

    const [isToggle, setIsToggle] = useState(false)

    const toggle = () => {
        setIsToggle(!isToggle)
    }

    useEffect(() => {
        console.log(admin.employee)
    }, [])
     
    const [selectedEmployee, setSelectedEmployee] = useState(null)
    
    useEffect(() => {
    const fetchEmployee = async () => {
        const url = 'http://localhost/api/employee'
        const response = await fetch(`${url}?${searchParams.toString()}`, {
            headers: {
                'Authorization': `Bearer ${admin.token}`
            }
        })

        
        if (!response.ok) {
            throw new Error('Failed to fetch employee')
        }

        const json = await response.json()

        dispatch({ type: 'SET_USER', payload: json.totalEmployees })
        setCurrentPage(json.currentPage)
        setTotalPage(json.totalPage)
    }

        fetchEmployee()
    }, [dispatch, searchParams])

    const resetForm = () => {
        setFullName('')
        setEmail('')
        setPassword('')
        setPhoneNumber('')
        setRole(0)

        if (selectedEmployee)
            setSelectedEmployee(null)
    }
    
    const handleEdit = (employee) => {
        setSelectedEmployee(employee)
        setFullName(employee.full_name)
        setEmail(employee.email)
        setPhoneNumber(employee.phone_number)
        setRole(employee.role)
        setIsToggle(true)
    }

    const handleSave = async (e) => {
        e.preventDefault()

    if (!selectedEmployee) 
        return

    const updatedData = {}

    const fields = [
        'full_name', 'email', 'phone_number', 'role'
      ]

      // Loop through the fields and add changed values to updatedData
      fields.forEach(field => {
        if (selectedEmployee[field] !== eval(field))
            updatedData[field] = eval(field)
      })

      // If no data has changed, don't proceed with the API call
      if (Object.keys(updatedData).length === 0)
        return

      console.log(updatedData)

      try {
          const response = await fetch(`http://localhost/api/employee/${selectedEmployee.employee_id}`, {
              method: 'PATCH',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${admin.token}`
              },
              body: JSON.stringify(updatedData)
          })

          if (!response.ok)
              throw new Error('Failed to update employee')

          const json = await response.json()
          console.log(json)
          setIsToggle(false)
          showNotification(json.message)
          dispatch({ type: 'CLEAR' })
          dispatch({ type: 'UPDATE_EMPLOYEE', payload: json.employee })

          resetForm()
      } 
      catch (error) {
          console.error('Error updating employee:', error)
      }
  }

  const handleUpload = async (e) => {
      e.preventDefault()

      try {
            const response = await fetch('http://localhost/api/employee/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${admin.token}`
                },
                body: JSON.stringify({ full_name, email, password, phone_number, role })
            })

            if (!response.ok)
                throw new Error(`HTTP error! Status: ${response.status}`)

            const json = await response.json()

            setIsToggle(false)
            showNotification(json.message)

            dispatch({type: 'ADD_USER', payload: json.employee})

            resetForm()
        }
        catch (error) {
            console.error(error)
        }
    }
    
    const [filter, setFilter] = useState('')
    
    const handleRefresh = () => {
        setSearchParams({})
    }

    const handleFilter = (role, full_name) => {
        handleRefresh()

        if (full_name) {
        searchParams.set('full_name', full_name)
        setSearchParams(searchParams)
        }

        if (role) {
            searchParams.set('role', role)
            setSearchParams(searchParams)
        }
    }

    return (
        <>
            {!isToggle ? (
                <div className='employee-container'>
                    <div className = 'employee-controller'>
                        <select onChange={(e) => handleFilter(e.target.value, '')}>
                            <option value=''>Tất cả</option>
                            <option value='Điều hành'>Điều hành</option>
                            <option value='Admin'>Admin</option>
                            <option value='Quản lí kho'>Quản lí kho</option>
                            <option value='Bán hàng'>Bán hàng</option>
                        </select>

                        <div className='employee-search'>
                            <input
                            type='text'
                            placeholder='Search for...'
                            value={filter}
                            onChange={(e) => {
                                handleFilter('', e.target.value);
                                setFilter(e.target.value);
                            }}
                            />
                            <i className='fa-solid fa-magnifying-glass'></i>
                        </div>

                        <div className='employee-icon'>
                            <button onClick={handleRefresh}><i className='fa-solid fa-rotate-right'></i>Refresh</button>
                            <button onClick={toggle}><i className="fa-solid fa-plus"></i>Thêm nhân viên</button>
                        </div>
                    </div>
        
                    <div className='employee-header'>
                        <span>Họ tên</span>
                        <span>Email</span>
                        <span>Số điện thoại</span>
                        <span>Ngày thêm</span>
                        <span>Vai trò</span>
                        <span>Chỉnh sửa</span>
                    </div>
                    {users?.map((u) => (
                        <EmployeeCard key={u.employee_id} employee={u} handleEdit={handleEdit} />
                    ))}
                    {totalPage > 1 && (
                        <Pagination
                            totalPage={totalPage}
                            currentPage={currentPage}
                        />
                    )}
                </div>
            ) : (
                <div className='add-employee-container'>
                <h2>{selectedEmployee ? 'Chỉnh sửa' : 'Thêm mới'}</h2>
                <span className='title' type='submit'>Trang chủ / {selectedEmployee ? 'Cập nhật nhân viên' : 'Thêm mới nhân viên'}</span><br/>
                <button type='button' onClick={toggle}>Quay lại danh sách</button>
                <form onSubmit={selectedEmployee ? handleSave : handleUpload} className='add-employee'>
                <div className='add-employee-account'>

                <label>Họ tên</label><br/>
                <input
                    type='text'
                    placeholder='Họ tên'
                    value={full_name}
                    onChange={(e) => setFullName(e.target.value)}
                /><br/>
      
                <label>Email</label><br/>
                <input
                    type='text'
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                /><br/>

                {!selectedEmployee && (
                <>
                    <label>Mật khẩu</label><br/>
                    <input
                        type='text'
                        placeholder='Mật khẩu'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    /><br/>
                </>
                )}

                <label>Số điện thoại</label><br/>        
                <input
                    type='tel'
                    placeholder='Số điện thoại'
                    value={phone_number}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                /><br/>

                <label>Vai trò</label><br/>
                <select value={role} onChange={(e) => setRole(Number(e.target.value))}>
                    <option value=''>Vai trò</option>
                    <option value={1}>Điều hành</option>
                    <option value={2}>Admin</option>
                    <option value={3}>Bán hàng</option>
                    <option value={4}>Quản lí kho</option>
                </select><br/>
      
                  <button type='submit'>{selectedEmployee ? 'Lưu lại' : 'Thêm mới'}</button>
      
                  </div>
                  <div className='add-employee-info'> 
                    
                  </div>
                </form>
              </div>
            )}
          </>
    )
}
