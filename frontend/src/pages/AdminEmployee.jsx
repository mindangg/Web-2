import React, { useState, useEffect } from 'react'

import EmployeeCard from '../components/Admin/EmployeeCard'

import { useAdminContext } from '../hooks/useAdminContext'
import { useUserContext } from '../hooks/useUserContext'

import { useNotificationContext } from '../hooks/useNotificationContext'

import CustomPagination from '../components/CustomPagination.jsx'
import Confirm from '../components/Confirm.jsx'

import { useSearchParams } from 'react-router-dom'

export default function AdminEmployee() {
    const { admin } = useAdminContext()
    const { users, dispatch } = useUserContext()
    const { showNotification } = useNotificationContext()

    const [showConfirm, setShowConfirm] = useState(false)

    const [currentPage, setCurrentPage] = useState(1)
    const [totalPage, setTotalPage] = useState(0)
    const [searchParams, setSearchParams] = useSearchParams(`limit=10`)

    const [full_name, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [phone_number, setPhoneNumber] = useState('')
    const [role, setRole] = useState('')

    const [role_name, setRoleName] = useState('')
    const [functions, setFunctions] = useState([])

    const [isToggle, setIsToggle] = useState(false)
    const [isToggleRole, setIsToggleRole] = useState(false)
    const [isToggleManage, setIsToggleManage] = useState(false)

    const [selectedEmployee, setSelectedEmployee] = useState(null)
    const [selectedRole, setSelectedRole] = useState(null)

    const [allRoles, setAllRoles] = useState([])

    const toggle = () => {
        setFullName('')
        setEmail('')
        setPassword('')
        setPhoneNumber('')
        setRole('')
        setSelectedEmployee(null)
        setIsToggle(!isToggle)
    }

    const toggleRole = () => {
        setRoleName('')
        setFunctions([])
        setSelectedRole(null)
        setIsToggleRole(!isToggleRole)
    }

    const fetchEmployee = async () => {
        const url = 'http://localhost/api/employee'
        const response = await fetch(`${url}?${searchParams.toString()}`, {
            headers: {
                'Authorization': `Bearer ${admin.token}`
            }
        })
        
        if (!response.ok)
            throw new Error('Failed to fetch employee')

        const json = await response.json()
        // console.log(json)

        dispatch({ type: 'SET_USER', payload: json.totalEmployees })
        setCurrentPage(json.currentPage)
        setTotalPage(json.totalPage)
    }

    const fetchRole = async () => {
        try {
            const response = await fetch('http://localhost/api/role', {
                headers: {
                    'Authorization': `Bearer ${admin.token}`
                }
            })

            if (!response.ok)
                return console.error('Error fetching role:', response.status)
            
            const json = await response.json()
            // console.log(json)

            setAllRoles(json)
        }
        catch (error) {
            console.error('Error fetching role:', error)
        }
    }
     
    useEffect(() => {
        fetchEmployee()
        fetchRole()
    }, [dispatch, searchParams])

    const handleEdit = (employee) => {
        setSelectedEmployee(employee)
        setFullName(employee.full_name)
        setEmail(employee.email)
        setPhoneNumber(employee.phone_number)
        setRole(employee.role.role_id)
        setIsToggle(true)
    }
    
    const handleEditRole = (role) => {
        setSelectedRole(role)
        setRoleName(role.role_name)
        setFunctions(role.functions)
        setIsToggleRole(true)
    }

    const handleSave = async (e) => {
        e.preventDefault()

        if (!selectedEmployee) 
            return

        const updatedData = {}

        const fields = [
            'full_name', 'email', 'phone_number', 'role'
        ]

        fields.forEach(field => {
            if (selectedEmployee[field] !== eval(field))
                updatedData[field] = eval(field)
        })

        if (Object.keys(updatedData).length === 0)
            return

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

            showNotification(json.message)

            //   dispatch({ type: 'UPDATE_EMPLOYEE', payload: json.employee })
                
            fetchEmployee()
            toggle()
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

            showNotification(json.message)

            // dispatch({type: 'ADD_USER', payload: json.employee})
            fetchEmployee()
            toggle()
        }
        catch (error) {
            console.error(error)
        }
    }
    
    const [filter, setFilter] = useState('')
    const [filterRole, setFilterRole] = useState('')
    
    const handleRefresh = () => {
        setFilter('')
        setFilterRole('')
        setSearchParams({})
    }

    const handleFilter = (role, full_name) => {
        const newParams = new URLSearchParams(searchParams)

        if (full_name !== '')
            newParams.set('full_name', full_name)
        else
            newParams.delete('full_name')

        if (role !== '')
            newParams.set('role', role)
        else
            newParams.delete('role')

        setSearchParams(newParams)
    }

    const functionss = [
        { id: 1, name: 'Người dùng' },
        { id: 2, name: 'Nhân viên' },
        { id: 3, name: 'Sản phẩm' },
        { id: 4, name: 'Kho hàng' },
        { id: 5, name: 'Đơn hàng' },
        { id: 6, name: 'Thống kê' }
    ]    
    
    const actions = ['Xem', 'Thêm', 'Sửa', 'Xóa']   

    const handleCheckboxChange = (funcId, funcName, action) => {
        setFunctions(prev => {
            const existing = prev.find(p => p.functional_id === funcId)
    
            if (existing) {
                const hasAction = existing.actions.includes(action)
                let updatedActions
    
                if (hasAction)
                    updatedActions = existing.actions.filter(a => a !== action)
                
                else {
                    updatedActions = [...existing.actions, action]
    
                    if (['Thêm', 'Sửa', 'Xóa'].includes(action) && !updatedActions.includes('Xem'))
                        updatedActions.push('Xem')
                }
    
                if (updatedActions.length === 0)
                    return prev.filter(p => p.functional_id !== funcId)
                
                else {
                    return prev.map(p =>
                        p.functional_id === funcId ? { ...p, actions: updatedActions } : p
                    )
                }
            } 
            else {
                let newActions = [action]
                if (['Thêm', 'Sửa', 'Xóa'].includes(action))
                    newActions.push('Xem')
    
                return [...prev, {
                    functional_id: funcId,
                    function_name: funcName,
                    actions: newActions
                }]
            }
        })
    }

    const hasPermission = (admin, functionName, action) => {
        if (admin && admin.employee[0].role.functions) {
            return admin.employee[0].role.functions.some(permission => 
                permission.function_name === functionName &&
                permission.actions.includes(action)
            )
        }
    }  
    
    const handleSaveRole = async (e) => {
        e.preventDefault()

        if (!selectedRole)
            return
    
        try {
            const response = await fetch(`http://localhost/api/role/${selectedRole.role_id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${admin.token}`
                },
                body: JSON.stringify({ role_name, functions })
            })

            if (!response.ok)
                throw new Error('Failed to update role')
    
            fetchRole()
            toggleRole()
        } 
        catch (error) {
            console.error('Error updating role:', error)
        }
    }

    const handleUploadRole = async (e) => {
        e.preventDefault()

        try {
            const response = await fetch('http://localhost/api/role', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${admin.token}`
                },
                body: JSON.stringify({ role_name, functions })
            })

            if (!response.ok)
                throw new Error(`HTTP error! Status: ${response.status}`)

            fetchRole()
            toggleRole()
        }
        catch (error) {
            console.error(error)
        }
    }
    
    const handleDeleteRole = async (id) => {
        try {
            const response = await fetch('http://localhost/api/role/' + id, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${admin.token}`
                }
            })
    
            if (!response.ok) {
                console.error('Failed to delete role')
                return
            }

            fetchRole()
            fetchEmployee()
        }
        catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        console.log(filterRole)
    })

    return (
        <>
            {!isToggle && (
                <div className='employee-container'>
                    <div className = 'employee-controller'>
                        <select value={filterRole} onChange={(e) => {
                                setFilterRole(e.target.value)
                                handleFilter(e.target.value, filter)
                            }}>
                            <option value=''>Tất cả</option>
                            {allRoles?.map(r => (
                                <option key={r.role_id} value={r.role_name}>{r.role_name}</option>
                            ))}
                        </select>

                        <div className='employee-search'>
                            <input
                            type='text'
                            placeholder='Search for...'
                            value={filter}
                            onChange={(e) => {
                                handleFilter(filterRole, e.target.value)
                                setFilter(e.target.value)
                            }}
                            />
                            <i className='fa-solid fa-magnifying-glass'></i>
                        </div>

                        <div className='employee-icon'>
                            <button onClick={handleRefresh}><i className='fa-solid fa-rotate-right'></i>Refresh</button>
                            {hasPermission(admin, 'Nhân viên', 'Thêm') && (
                                <button onClick={toggle}><i className="fa-solid fa-plus"></i>Thêm nhân viên</button>
                            )}
                            {hasPermission(admin, 'Nhân viên', 'Thêm') && (
                                <button onClick={toggleRole}><i className="fa-solid fa-plus"></i>Thêm vai trò</button>
                            )}
                            <button onClick={() => setIsToggleManage(!isToggleManage)}><i className="fa-solid fa-plus"></i>Quản lí vai trò</button>
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
                        <EmployeeCard key={u.employee_id} employee={u} handleEdit={handleEdit} hasPermission={hasPermission}/>
                    ))}
                    {totalPage > 1 && (
                        <CustomPagination
                            totalPage={totalPage}
                            currentPage={currentPage}
                            searchParams={searchParams}
                            setSearchParams={setSearchParams}
                        />
                    )}
                </div>
            )}

            {isToggle && (
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
                    {allRoles?.map(r => (
                        <option value={r.role_id}>{r.role_name}</option>
                    ))}
                </select><br/>
      
                <button type='submit'>{selectedEmployee ? 'Lưu lại' : 'Thêm mới'}</button>
    
                </div>
                <div className='add-employee-info'> 
                
                </div>
                </form>
              </div>
            )}
            {isToggleRole && (
                <div className='add-role-container'>
                    <div className='add-role'>
                        <i className='fa-solid fa-xmark' onClick={toggleRole}></i>
                        {selectedRole ? (
                            <h2>Chỉnh sửa vai trò</h2>
                        ) : (
                            <h2>Thêm vai trò</h2>
                        )}
                        <form onSubmit={selectedRole ? handleSaveRole : handleUploadRole}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '30px', justifyContent: 'center'}}>
                                <label>Tên</label>
                                <input style={{ width: '30%'}}
                                        value={role_name}
                                        onChange={(e) => setRoleName(e.target.value)}></input>
                            </div>
                            <div className='add-role-header'>
                                <span>Chức năng</span>
                                {actions.map(action => <span key={action}>{action}</span>)}
                            </div>

                            {functionss.map(func => {
                                const currentFunctions = functions.find(p => p.functional_id === func.id)?.actions || []
                                const isRelatedActionChecked = currentFunctions.some(a => ['Thêm', 'Sửa', 'Xóa'].includes(a))

                                return (
                                    <div key={func.id} className='add-role-items'>
                                        <span>{func.name}</span>
                                        {actions.map(action => (
                                            <input
                                                key={`${func.id}-${action}`}
                                                type='checkbox'
                                                checked={currentFunctions.includes(action)}
                                                onChange={() => handleCheckboxChange(func.id, func.name, action)}
                                                disabled={action === 'Xem' && isRelatedActionChecked}
                                            />
                                        ))}
                                    </div>
                                )
                            })}
        
                            <div style={{ textAlign: 'center' }}>
                                {selectedRole ? (
                                    <button type='submit'>Lưu lại</button>
                                ) : (
                                    <button type='submit'>Thêm</button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isToggleManage && (
                <div className='manage-role-container'>
                    <div className='manage-role'>
                        <i className='fa-solid fa-xmark' id='manage-role-close' onClick={() => setIsToggleManage(!isToggleManage)}></i>
                        <h2>Vai trò</h2>
                        <div className='manage-role-header'>
                            <span>Vai trò</span>
                            <span>Chỉnh sửa</span>
                        </div>
                        {allRoles?.map(r => (
                            <div key={r.role_id} className='manage-role-items'>
                                <span>{r.role_name}</span>
                                <span className='manage-role-action'>
                                {hasPermission(admin, 'Nhân viên', 'Sửa') && (
                                    <i className='fa-solid fa-pen-to-square' onClick={() => handleEditRole(r)}></i>
                                )}
                                {hasPermission(admin, 'Nhân viên', 'Xóa') && (
                                    <i className='fa-solid fa-trash-can' onClick={() => setShowConfirm(r.role_id)}></i>
                                )}
                                </span>

                                {showConfirm === r.role_id && (
                                    <Confirm
                                        message='Bạn có chắc muốn xóa vai trò này?'
                                        onConfirm={() => handleDeleteRole(r.role_id)}
                                        onCancel={() => setShowConfirm(null)}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
          </>
          
    )
}
