import React, { useState, useEffect, useRef } from "react";
import "../../styles/Cart/PaymentInfoUser.css";
import PropTypes from "prop-types";
import { useAuthContext } from '../../hooks/useAuthContext';
import qrCode from "../../../public/qr.png"; 

function PaymentInfoUser({ userData = {} }) {
  const { user } = useAuthContext();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressList, setShowAddressList] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("direct_payment");
  const [addressList, setAddressList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showNotification } = useNotificationContext();
  
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

  // Form errors
  const [formErrors, setFormErrors] = useState({
    full_name: "",
    phone_number: "",
    house_number: "",
    street: "",
    ward: "",
    district: "",
    city: ""
  });

  // Refs for input fields
  const inputRefs = {
    full_name: useRef(null),
    phone_number: useRef(null),
    house_number: useRef(null),
    street: useRef(null),
    ward: useRef(null),
    district: useRef(null),
    city: useRef(null)
  };

  // Xác thực định dạng số điện thoại (10 chữ số, bắt đầu bằng 0)
  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^0\d{9}$/;
    return phoneRegex.test(phone);
  };

  // Xác thực form trước khi gửi
  const validateForm = () => {
    const errors = {};
    let isValid = true;
    let firstErrorField = null;

    if (!formData.full_name.trim()) {
      errors.full_name = "Họ và tên là bắt buộc";
      isValid = false;
      firstErrorField = firstErrorField || "月末";
    } else if (formData.full_name.length > 30) {
      errors.full_name = "Họ và tên không được vượt quá 30 ký tự";
      isValid = false;
      firstErrorField = firstErrorField || "full_name";
    }

    if (!formData.phone_number.trim()) {
      errors.phone_number = "Số điện thoại là bắt buộc";
      isValid = false;
      firstErrorField = firstErrorField || "phone_number";
    } else if (!validatePhoneNumber(formData.phone_number)) {
      errors.phone_number = "Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0";
      isValid = false;
      firstErrorField = firstErrorField || "phone_number";
    }

    if (!formData.house_number.trim()) {
      errors.house_number = "Số nhà là bắt buộc";
      isValid = false;
      firstErrorField = firstErrorField || "house_number";
    } else if (formData.house_number.length > 10) {
      errors.house_number = "Số nhà không được vượt quá 10 ký tự";
      isValid = false;
      firstErrorField = firstErrorField || "house_number";
    }

    if (!formData.street.trim()) {
      errors.street = "Đường là bắt buộc";
      isValid = false;
      firstErrorField = firstErrorField || "street";
    } else if (formData.street.length > 50) {
      errors.street = "Đường không được vượt quá 50 ký tự";
      isValid = false;
      firstErrorField = firstErrorField || "street";
    }

    if (!formData.ward.trim()) {
      errors.ward = "Phường/Xã là bắt buộc";
      isValid = false;
      firstErrorField = firstErrorField || "ward";
    } else if (formData.ward.length > 50) {
      errors.ward = "Phường/Xã không được vượt quá 50 ký tự";
      isValid = false;
      firstErrorField = firstErrorField || "ward";
    }

    if (!formData.district.trim()) {
      errors.district = "Quận/Huyện là bắt buộc";
      isValid = false;
      firstErrorField = firstErrorField || "district";
    } else if (formData.district.length > 50) {
      errors.district = "Quận/Huyện không được vượt quá 50 ký tự";
      isValid = false;
      firstErrorField = firstErrorField || "district";
    }

    if (!formData.city.trim()) {
      errors.city = "Thành phố là bắt buộc";
      isValid = false;
      firstErrorField = firstErrorField || "city";
    } else if (formData.city.length > 50) {
      errors.city = "Thành phố không được vượt quá 50 ký tự";
      isValid = false;
      firstErrorField = firstErrorField || "city";
    }

    setFormErrors(errors);

    // Focus vào trường lỗi đầu tiên
    if (!isValid && firstErrorField && inputRefs[firstErrorField].current) {
      inputRefs[firstErrorField].current.focus();
    }

    return isValid;
  };

  // Lấy danh sách địa chỉ khi component mount
  useEffect(() => {
    if (!user?.user?.user_account_id || !user?.token) {
      setError("Không thể tải danh sách địa chỉ. Vui lòng đăng nhập lại.");
      return;
    }
    fetchAddresses();
  }, [user]);

  useEffect(() => {
    // Cập nhật dataset để Payment.jsx có thể truy cập
    const infoUserDiv = document.querySelector(".info-user");
    if (infoUserDiv) {
      infoUserDiv.dataset.selectedAddressId = selectedAddress || "";
      infoUserDiv.dataset.paymentMethod = selectedPayment;
    }
  }, [selectedAddress, selectedPayment]);

  const fetchAddresses = async () => {
    setLoading(true);
    setError(null);
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
        const defaultAddress = data.find((addr) => addr.is_default) || data[0];
        setSelectedAddress(defaultAddress?.user_information_id || null);
      } else {
        setError(data.message || "Lỗi khi tải danh sách địa chỉ");
      }
    } catch (error) {
      setError("Không thể kết nối đến server. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = (value) => {
    setSelectedPayment(value);
  };

  const handleChooseNewAddress = () => {
    setShowAddressList(true);
    setShowAddForm(false);
    setError(null);
  };

  const handleAddAddress = () => {
    setShowAddForm(true);
    setShowAddressList(false);
    setFormData({
      full_name: "",
      phone_number: "",
      house_number: "",
      street: "",
      ward: "",
      district: "",
      city: ""
    });
    setFormErrors({});
    setError(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Xóa lỗi của trường khi người dùng bắt đầu nhập
    setFormErrors(prev => ({
      ...prev,
      [name]: ""
    }));
  };

  const handleSaveAddress = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);
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
        showNotification("Đã thêm địa chỉ mới");
      } else {
        setError(data.message || "Lỗi khi thêm địa chỉ");
      }
    } catch (error) {
      setError("Không thể kết nối đến server. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // Get current selected address
  const currentAddress = addressList.find(addr => addr.user_information_id === selectedAddress);

  return (
    <div className="info-user">
      <h5>Thông tin khách hàng</h5>

      {error && <p className="error-message" style={{ color: "red" }}>{error}</p>}
      {loading && <p>Đang tải...</p>}

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

      <button id="selectAddressBtn" onClick={handleChooseNewAddress} disabled={loading}>
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
                    disabled={loading}
                  />
                  <div className="address-info">
                    <p><strong>{addr.full_name}</strong> ({addr.phone_number})</p>
                    <p>{`${addr.house_number}, ${addr.street}, ${addr.ward}, ${addr.district}, ${addr.city}`}</p>
                  </div>
                </label>
              </div>
            ))
          ) : (
            <p><span style={{ color: "red" }}>Bạn chưa có địa chỉ nào. Vui lòng thêm địa chỉ mới.</span></p>
          )}
          
          <button onClick={handleAddAddress} className="add-address-btn" disabled={loading}>
            Thêm địa chỉ mới
          </button>
          <button onClick={() => setShowAddressList(false)} className="cancel-btn" disabled={loading}>
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
              disabled={loading}
              ref={inputRefs.full_name}
            />
            {formErrors.full_name && <span className="error" style={{ color: "red" }}>{formErrors.full_name}</span>}
          </div>

          <div className="form-group">
            <label>Số điện thoại</label>
            <input
              type="text"
              name="phone_number"
              value={formData.phone_number}
              placeholder="Số điện thoại"
              onChange={handleFormChange}
              disabled={loading}
              ref={inputRefs.phone_number}
            />
            {formErrors.phone_number && <span className="error" style={{ color: "red" }}>{formErrors.phone_number}</span>}
          </div>

          <div className="form-group">
            <label>Số nhà</label>
            <input
              type="text"
              name="house_number"
              value={formData.house_number}
              placeholder="Số nhà"
              onChange={handleFormChange}
              disabled={loading}
              ref={inputRefs.house_number}
            />
            {formErrors.house_number && <span className="error" style={{ color: "red" }}>{formErrors.house_number}</span>}
          </div>

          <div className="form-group">
            <label>Đường</label>
            <input
              type="text"
              name="street"
              value={formData.street}
              placeholder="Đường"
              onChange={handleFormChange}
              disabled={loading}
              ref={inputRefs.street}
            />
            {formErrors.street && <span className="error" style={{ color: "red" }}>{formErrors.street}</span>}
          </div>

          <div className="form-group">
            <label>Phường/Xã</label>
            <input
              type="text"
              name="ward"
              value={formData.ward}
              placeholder="Phường/Xã"
              onChange={handleFormChange}
              disabled={loading}
              ref={inputRefs.ward}
            />
            {formErrors.ward && <span className="error" style={{ color: "red" }}>{formErrors.ward}</span>}
          </div>

          <div className="form-group">
            <label>Quận/Huyện</label>
            <input
              type="text"
              name="district"
              value={formData.district}
              placeholder="Quận/Huyện"
              onChange={handleFormChange}
              disabled={loading}
              ref={inputRefs.district}
            />
            {formErrors.district && <span className="error" style={{ color: "red" }}>{formErrors.district}</span>}
          </div>

          <div className="form-group">
            <label>Thành phố</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              placeholder="Thành phố"
              onChange={handleFormChange}
              disabled={loading}
              ref={inputRefs.city}
            />
            {formErrors.city && <span className="error" style={{ color: "red" }}>{formErrors.city}</span>}
          </div>

          <div className="form-actions">
            <button onClick={handleSaveAddress} id="confirm-btn" disabled={loading}>
              {loading ? "Đang lưu..." : "Xác nhận"}
            </button>
            <button 
              onClick={() => setShowAddForm(false)} 
              id="cancel-btn"
              disabled={loading}
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
          disabled={loading}
        >
          <option value="direct_payment">Thanh toán trực tiếp</option>
          <option value="transfer_payment">Chuyển khoản</option>
        </select>
        {selectedPayment === "transfer_payment" && (
          <div className="qr-code" style={{ marginTop: "10px" }}>
            <p>Quét mã QR để thanh toán:</p>
            <img src={qrCode} alt="QR Code for Payment" style={{ maxWidth: "200px" }} />
          </div>
        )}
      </div>
    </div>
  );
}

PaymentInfoUser.propTypes = {
  userData: PropTypes.object
};

export default PaymentInfoUser;