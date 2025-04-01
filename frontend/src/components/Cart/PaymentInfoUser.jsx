import React, { useState } from "react";
import "../../styles/Cart/PaymentInfoUser.css"
import PropTypes from 'prop-types';
function PaymentInfoUser( {userData={}} ){
    const [selectedAddress,setSelectedAddress]= useState('default_address');
    const [selectedPayment,setSelectedPayment]= useState('direct_payment');

    const checkUserData = {
        name: userData.name || 'Đỗ Trần Huy Bảo',
        email: userData.email || 'huybao05@gmail.com',
        phone: userData.phone || '0123456789'
    };

    const handleAddress = (value) => {
        setSelectedAddress(value);
      };
    const handlePayment= (value) =>{
        setSelectedPayment(value);
    };
    return(
        <div className="info-user">
            <h5>Thông tin khách hàng</h5>
            <p><b>Họ và tên:</b> {checkUserData.name}</p>
            <p><b>Email:</b> {checkUserData.email}</p>
            <p><b>Điện thoại:</b> {checkUserData.phone}</p>
            <h5><b>Địa chỉ giao hàng</b></h5>
            <label htmlFor="address"><b>Chọn địa chỉ:</b> </label>
            <select id="address" value={selectedAddress} onChange={(e)=>handleAddress(e.target.value)}>
                <option value="default_address">Địa chỉ mặc định</option>
                <option value="new_address">Địa chỉ mới</option>
            </select>
            <label htmlFor="payment" ><b>Phương thức thanh toán</b></label>
            <select id="payment" value={selectedPayment} onChange={(e) => handlePayment(e.target.value)}>
                <option value="direct_payment">Thanh toán trực tiếp</option>
                <option value="transfer_payment">Chuyển khoản</option>
            </select>
        </div>
    );
}

    PaymentInfoUser.propTypes = {
        userData: PropTypes.shape({
            name: PropTypes.string,
            email: PropTypes.string,
            phone: PropTypes.string
        })
    };


export default PaymentInfoUser