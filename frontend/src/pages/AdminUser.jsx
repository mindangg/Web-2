import React, { useEffect, useState } from 'react'

import UserCard from '../components/Admin/UserCard'

import '../styles/Admin.css'

import { useUserContext } from '../hooks/useUserContext'

import { useNotificationContext } from '../hooks/useNotificationContext'

export default function AdminUser() {
  const { users, dispatch } = useUserContext()
  const { showNotification } = useNotificationContext()

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
      const response = await fetch('http://localhost/api/user', {
        // headers: {
        //   'Authoriztion': `Bearer ${admin.token}`
        // }
      })

        
      if (!response.ok) {
          throw new Error('Failed to fetch user')
      }

      const json = await response.json()

      dispatch({ type: 'SET_USER', payload: json})
    }

    fetchUser()
  }, [dispatch])

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

      // Create an object to store the updated data
      const updatedData = {};

      // List of fields to compare between selectedUser and state
      const fields = [
          'username', 'email', 'full_name', 'phone_number', 
          'house_number', 'street', 'ward', 'district', 'city', 'status'
      ];

      // Loop through the fields and add changed values to updatedData
      fields.forEach(field => {
        if (selectedUser[field] !== eval(field)) {
          updatedData[field] = eval(field);
        }
      });

      // If no data has changed, don't proceed with the API call
      if (Object.keys(updatedData).length === 0) {
        console.log("No changes made to the user");
        return;
      }

      console.log(updatedData)

      try {
          const response = await fetch(`http://localhost/api/user/${selectedUser.user_account_id}`, {
              method: 'PATCH',
              headers: {
                  'Content-Type': 'application/json',
                  // 'Authorization': `Bearer ${admin.token}`
              },
              // body: JSON.stringify({ updatedData })
              body: JSON.stringify({ username: 'ABCXYZ' })
          })

          if (!response.ok)
              throw new Error('Failed to update user')

          const json = await response.json()
          dispatch({ type: 'UPDATE_USER', payload: json })

          setIsToggle(false)
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
          setSelectedUser(null)
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
                  // 'Authorization': `Bearer ${admin.token}`
              },
              body: JSON.stringify({ username, email, password, full_name, phone_number, 
                                    house_number, street, ward, district, city })
          })

          if (!response.ok)
              throw new Error(`HTTP error! Status: ${response.status}`)

          const json = await response.json()

          setIsToggle(false)
          showNotification(json.message)

          dispatch({type: 'ADD_USER', payload: json.user})

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
      }
      catch (error) {
          console.error(error)
      }
  }

  useEffect(() => {
    console.log("Updated users list:", users);  // This should show the updated list with the new user
}, [users]);  // Trigger re-render when users state changes
  
  return (
    <>
      {!isToggle ? (
        <div className='user-container'>
          <div>
            <button onClick={toggle}>Thêm tài khoản</button>
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
            <UserCard key={u.user_account_id} user={u} handleEdit={handleEdit} />
          ))}
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
                <label>Password</label><br/>
                <input
                  type='text'
                  placeholder='Password'
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
