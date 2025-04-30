import React, { useEffect, useState } from 'react'

import UserCard from '../components/Admin/UserCard'

import { useAdminContext } from '../hooks/useAdminContext'
import { useUserContext } from '../hooks/useUserContext'

import { useNotificationContext } from '../hooks/useNotificationContext'

import Pagination from '../components/CustomPagination.jsx';

import { useSearchParams } from 'react-router-dom';

export default function AdminUser() {
  const { admin } = useAdminContext()
  const { users, dispatch } = useUserContext()
  const { showNotification } = useNotificationContext()

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPage, setTotalPage] = useState(0)
  const [currentUsers, setCurrentUsers] = useState([])
  const [searchParams, setSearchParams] = useSearchParams(`limit=10`)

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [full_name, setFullName] = useState('')
  const [phone_number, setPhoneNumber] = useState('')
  const [house_number, setHouseNumber] = useState('')
  const [street, setStreet] = useState('')
  const [ward, setWard] = useState('')
  const [district, setDistrict] = useState('')
  const [city, setCity] = useState('')
  const [status, setStatus] = useState('')

  const [isToggle, setIsToggle] = useState(false)

  const toggle = () => {
    setIsToggle(!isToggle)
  }
  
  const [selectedUser, setSelectedUser] = useState(null)
 
  useEffect(() => {
    const fetchUser = async () => {
      const url = 'http://localhost/api/user'
      const response = await fetch(`${url}?${searchParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${admin.token}`
        }
      })
        
      if (!response.ok) {
          throw new Error('Failed to fetch user')
      }

      const json = await response.json()

      dispatch({ type: 'SET_USER', payload: json.totalUsers })
      setCurrentPage(json.currentPage)
      setTotalPage(json.totalPage)
    }

    fetchUser()
  }, [dispatch, searchParams])

  const resetForm = () => {
    setUsername('')
    setEmail('')
    setFullName('')
    setPhoneNumber('')
    setHouseNumber('')
    setStreet('')
    setWard('')
    setDistrict('')
    setCity('')
    setStatus('')

    if (selectedUser)
      setSelectedUser(null)
  }

  const handleEdit = (user) => {
    setSelectedUser(user)
    setUsername(user.username)
    setEmail(user.email)
    setFullName(user.full_name)
    setPhoneNumber(user.phone_number)
    setHouseNumber(user.house_number)
    setStreet(user.street)
    setWard(user.ward)
    setDistrict(user.district)
    setCity(user.city)
    setStatus(user.status)
    setIsToggle(true)
  }

  const handleSave = async (e) => {
      e.preventDefault()

      if (!selectedUser) 
        return

      const updatedData = {}

      const fields = [
          'username', 'email', 'full_name', 'phone_number', 
          'house_number', 'street', 'ward', 'district', 'city', 'status'
      ]

      // Loop through the fields and add changed values to updatedData
      fields.forEach(field => {
        if (selectedUser[field] !== eval(field)) {
          updatedData[field] = eval(field)
        }
      })

      // If no data has changed, don't proceed with the API call
      if (Object.keys(updatedData).length === 0)
        return

      console.log(updatedData)

      try {
          const response = await fetch(`http://localhost/api/user/${selectedUser.user_account_id}`, {
              method: 'PATCH',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${admin.token}`
              },
              body: JSON.stringify(updatedData)
          })

          if (!response.ok)
              throw new Error('Failed to update user')

          const json = await response.json()
          console.log(json)
          setIsToggle(false)
          showNotification(json.message)
          dispatch({ type: 'UPDATE_USER', payload: json.user })

          resetForm()
      } 
      catch (error) {
          console.error('Error updating user:', error)
      }
  }

  const handleUpload = async (e) => {
      e.preventDefault()

      try {
          const response = await fetch('http://localhost/api/user/create', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${admin.token}`
              },
              body: JSON.stringify({ username, email, password, full_name, phone_number, 
                                    house_number, street, ward, district, city })
          })

          if (!response.ok)
              throw new Error(`HTTP error! Status: ${response.status}`)

          const json = await response.json()
          console.log(json)

          setIsToggle(false)
          showNotification(json.message)

          dispatch({type: 'ADD_USER', payload: json.user})

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
  
  const handleFilter = (status, full_name) => {
    handleRefresh()

    if (full_name) {
      searchParams.set('full_name', full_name)
      setSearchParams(searchParams)
    }

    if (status) {
        searchParams.set('status', status)
        setSearchParams(searchParams)
    }
  }

  const hasPermission = (admin, functionName, action) => {
    if (admin && admin.employee[0].role.functions) {
        return admin.employee[0].role.functions.some(permission => 
            permission.function_name === functionName &&
            permission.actions.includes(action)
        )
    }
  }  
  
  return (
    <>
      {!isToggle ? (
        <div className='user-container'>
          <div className = 'user-controller'>
              <select onChange={(e) => handleFilter(e.target.value, '')}>
                  <option value=''>Tất cả</option>
                  <option value='Hoạt động'>Hoạt động</option>
                  <option value='Bị khóa'>Bị khóa</option>
              </select>

              <div className='user-search'>
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

              <div className='user-icon'>
                  <button onClick={handleRefresh}><i className='fa-solid fa-rotate-right'></i>Refresh</button>
                  {hasPermission(admin, 'Người dùng', 'Thêm') && (
                    <button onClick={toggle}><i className='fa-solid fa-plus'></i>Thêm tài khoản</button>
                  )}
              </div>
          </div>
  
          <div className='user-header'>
            <span>Họ tên</span>
            <span>Email</span>
            <span>Số điện thoại</span>
            <span>Địa chỉ</span>
            <span>Ngày đăng kí</span>
            <span>Tình trạng</span>
            <span>Chỉnh sửa</span>
          </div>
  
          {users?.map((u) => (
            <UserCard key={u.user_account_id} user={u} handleEdit={handleEdit} hasPermission={hasPermission}/>
          ))}
          {totalPage > 1 && (
              <Pagination
                  totalPage={totalPage}
                  currentPage={currentPage}
              />
          )}
        </div>
      ) : (
        <div className='add-user-container'>
          <h2>{selectedUser ? 'Chỉnh sửa' : 'Thêm mới'}</h2>
          <span className='title' type='submit'>Trang chủ / {selectedUser ? 'Cập nhật người dùng' : 'Thêm mới người dùng'}</span><br/>
          <button type='button' onClick={toggle}>Quay lại danh sách</button>
          <form onSubmit={selectedUser ? handleSave : handleUpload} className='add-user'>
            <div className='add-user-account'>
            <label>Username</label><br/>
            <input
              type='text'
              placeholder='User name'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            /><br/>

            <label>Email</label><br/>
            <input
              type='text'
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            /><br/>

          {selectedUser 
            ? (
              <>
                <label>Status</label>
                <br />
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value='Hoạt động'>Hoạt động</option>
                  <option value='Bị khóa'>Bị khóa</option>
                </select><br/>
              </>
              )
              
            : (
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

            <label>Họ tên</label><br/>
            <input
              type='text'
              placeholder='Họ tên'
              value={full_name}
              onChange={(e) => setFullName(e.target.value)}
            /><br/>

            <label>Số điện thoại</label>   <br/>        
            <input
              type='tel'
              placeholder='Số điện thoại'
              value={phone_number}
              onChange={(e) => setPhoneNumber(e.target.value)}
            /><br/>

            <button type='submit'>{selectedUser ? 'Lưu lại' : 'Thêm mới'}</button>

            </div>
            <div className='add-user-info'>
            <label>Số nhà</label><br/>
            <input
              type='text'
              placeholder='Số nhà'
              value={house_number}
              onChange={(e) => setHouseNumber(e.target.value)}
            /><br/>

            <label>Đường</label><br/>
            <input
              type='text'
              placeholder='Đường'
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            /><br/>

            <label>Phường</label><br/>
            <input
              type='text'
              placeholder='Phường'
              value={ward}
              onChange={(e) => setWard(e.target.value)}
            /><br/>

            <label>Quận</label><br/>
            <input
              type='text'
              placeholder='Quận'
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            /><br/>

            <label>Thành phố</label><br/>
            <input
              type='text'
              placeholder='Thành phố'
              value={city}
              onChange={(e) => setCity(e.target.value)}
            /><br/>   
            </div>
          </form>
        </div>
      )}
    </>
  )
}
