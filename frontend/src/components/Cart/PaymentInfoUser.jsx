import React, { useState, useEffect } from "react";
import "../../styles/Cart/PaymentInfoUser.css";
import PropTypes from "prop-types";
import { useAuthContext } from '../../hooks/useAuthContext'; 

function PaymentInfoUser({ userData = {} }) {
  const { user } = useAuthContext();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressList, setShowAddressList] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("direct_payment");
  const [addressList, setAddressList] = useState([]);
  
  // Form fields for new address
  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    house_number: "",
    street: "",
    ward: "",
    district: "",
    city: ""
  });

  // Lấy danh sách địa chỉ khi component mount
  useEffect(() => {
    if (user?.user?.user_account_id) {
      fetchAddresses();
    }
  }, [user]);

  const fetchAddresses = async () => {
    try {
      const response = await fetch(
        `http://localhost/api/user/addresses/${user.user.user_account_id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setAddressList(data);
        // Chọn địa chỉ mặc định hoặc địa chỉ đầu tiên
        const defaultAddress = data.find((addr) => addr.is_default) || data[0];
        setSelectedAddress(defaultAddress?.user_information_id || null);
      } else {
        console.error("Error fetching addresses:", data.message);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const handlePayment = (value) => {
    setSelectedPayment(value);
  };

  const handleChooseNewAddress = () => {
    setShowAddressList(true);
    setShowAddForm(false);
  };

  const handleAddAddress = () => {
    setShowAddForm(true);
    setShowAddressList(false);
    // Reset form data when adding new address
    setFormData({
      full_name: "",
      phone_number: "",
      house_number: "",
      street: "",
      ward: "",
      district: "",
      city: ""
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveAddress = async () => {
    const { full_name, phone_number, house_number, street, ward, district, city } = formData;
    
    if (!full_name || !phone_number || !house_number || !street || !ward || !district || !city) {
      alert("Vui lòng điền đầy đủ thông tin địa chỉ");
      return;
    }

    try {
      const response = await fetch(`http://localhost/api/user/addresses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          account_id: user.user.user_account_id,
          ...formData
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setAddressList([...addressList, data.address]);
        setSelectedAddress(data.address.user_information_id);
        setShowAddForm(false);
        alert("Đã thêm địa chỉ mới");
      } else {
        alert("Lỗi khi thêm địa chỉ: " + data.message);
      }
    } catch (error) {
      console.error("Error adding address:", error);
      alert("Lỗi khi thêm địa chỉ");
    }
  };

  // Get current selected address
  const currentAddress = addressList.find(addr => addr.user_information_id === selectedAddress);

  return (
    <div className="info-user">
      <h5>Thông tin khách hàng</h5>
      
      {/* Hiển thị thông tin khách hàng từ địa chỉ được chọn */}
      {currentAddress ? (
        <>
          <p><b>Họ và tên:</b> {currentAddress.full_name}</p>
          <p><b>Số điện thoại:</b> {currentAddress.phone_number}</p>
          <p>
            <b>Địa chỉ:</b> {`${currentAddress.house_number}, ${currentAddress.street}, ${currentAddress.ward}, ${currentAddress.district}, ${currentAddress.city}`}
          </p>
        </>
      ) : (
        <>
          <p><b>Họ và tên:</b> Chưa có thông tin</p>
          <p><b>Số điện thoại:</b> Chưa có thông tin</p>
          <p><b>Địa chỉ:</b> Chưa chọn địa chỉ</p>
        </>
      )}

      <button id="selectAddressBtn" onClick={handleChooseNewAddress}>
        {currentAddress ? "Thay đổi thông tin" : "Thêm thông tin"}
      </button>

      {/* Danh sách địa chỉ để chọn */}
      {showAddressList && (
        <div className="address-list">
          <h5>Chọn địa chỉ:</h5>
          {addressList.length > 0 ? (
            addressList.map((addr) => (
              <div key={addr.user_information_id} className="address-item">
              <label className="address-radio">
                <input
                  type="radio"
                  name="address"
                  value={addr.user_information_id}
                  checked={selectedAddress === addr.user_information_id}
                  onChange={() => {
                    setSelectedAddress(addr.user_information_id);
                    setShowAddressList(false);
                  }}
                />
                <div className="address-info">
                  <p><strong>{addr.full_name}</strong> ({addr.phone_number})</p>
                  <p>{`${addr.house_number}, ${addr.street}, ${addr.ward}, ${addr.district}, ${addr.city}`}</p>
                </div>
              </label>
              </div>
            ))
          ) : (
            <p><span color="red">Bạn chưa có địa chỉ nào. Vui lòng thêm địa chỉ mới.</span></p>
          )}
          
          <button onClick={handleAddAddress} className="add-address-btn">
            Thêm địa chỉ mới
          </button>
          <button onClick={() => setShowAddressList(false)} className="cancel-btn">
            Hủy
          </button>
        </div>
      )}

      {/* Form thêm địa chỉ mới */}
      {showAddForm && (
        <div className="add-address-form">
          <h5>Thêm địa chỉ mới</h5>
          
          <div className="form-group">
            <label>Họ và tên</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              placeholder="Họ và tên"
              onChange={handleFormChange}
            />
          </div>

          <div className="form-group">
            <label>Số điện thoại</label>
            <input
              type="text"
              name="phone_number"
              value={formData.phone_number}
              placeholder="Số điện thoại"
              onChange={handleFormChange}
            />
          </div>

          <div className="form-group">
            <label>Số nhà</label>
            <input
              type="text"
              name="house_number"
              value={formData.house_number}
              placeholder="Số nhà"
              onChange={handleFormChange}
            />
          </div>

          <div className="form-group">
            <label>Đường</label>
            <input
              type="text"
              name="street"
              value={formData.street}
              placeholder="Đường"
              onChange={handleFormChange}
            />
          </div>

          <div className="form-group">
            <label>Phường/Xã</label>
            <input
              type="text"
              name="ward"
              value={formData.ward}
              placeholder="Phường/Xã"
              onChange={handleFormChange}
            />
          </div>

          <div className="form-group">
            <label>Quận/Huyện</label>
            <input
              type="text"
              name="district"
              value={formData.district}
              placeholder="Quận/Huyện"
              onChange={handleFormChange}
            />
          </div>

          <div className="form-group">
            <label>Thành phố</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              placeholder="Thành phố"
              onChange={handleFormChange}
            />
          </div>

          <div className="form-actions">
            <button onClick={handleSaveAddress} id="confirm-btn">
              Xác nhận
            </button>
            <button 
              onClick={() => setShowAddForm(false)} 
              id="cancel-btn"
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      <div className="payment-method">
        <label htmlFor="payment">
          <b>Phương thức thanh toán</b>
        </label>
        <select 
          id="payment" 
          value={selectedPayment} 
          onChange={(e) => handlePayment(e.target.value)}
        >
          <option value="direct_payment">Thanh toán trực tiếp</option>
          <option value="transfer_payment">Chuyển khoản</option>
        </select>
      </div>
    </div>
  );
}

export default PaymentInfoUser;