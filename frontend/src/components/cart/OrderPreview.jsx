import React from "react";
import "../../styles/Cart/OrderPreview.css";

function OrderPreview({ orderData, onConfirm, onCancel }) {
    const { user_information, payment_method, items, totalPrice } = orderData;

    return (
        <div className="order-preview-overlay">
            <div className="order-preview">
                <h3>Xem trước hóa đơn</h3>
                
                <div className="preview-section">
                    <h5>Thông tin khách hàng</h5>
                    <p><b>Họ và tên:</b> {user_information.full_name}</p>
                    <p><b>Số điện thoại:</b> {user_information.phone_number}</p>
                    <p><b>Địa chỉ:</b> {`${user_information.house_number}, ${user_information.street}, ${user_information.ward}, ${user_information.district}, ${user_information.city}`}</p>
                </div>

                <div className="preview-section" >
                    <p>Phương thức thanh toán: {payment_method === "direct_payment" ? "Thanh toán trực tiếp" : "Chuyển khoản"}</p>
                </div>

                <div className="preview-section">
                    <h5>Sản phẩm</h5>
                    <table>
                        <thead>
                            <tr>
                                <th>Tên sản phẩm</th>
                                <th>Số lượng</th>
                                <th>Giá</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr key={item.sku_id}>
                                    <td>{item.sku_name}</td>
                                    <td>{item.quantity}</td>
                                    <td>{(item.price * item.quantity).toLocaleString('vi-VN')}đ</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="2"><b>Tổng cộng</b></td>
                                <td>{totalPrice.toLocaleString('vi-VN')}đ</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <div className="preview-actions">
                    <button id="confirm-order-btn" onClick={onConfirm}>Xác nhận</button>
                    <button id="cancel-order-btn" onClick={onCancel}>Hủy</button>
                </div>
            </div>
        </div>
    );
}

export default OrderPreview;