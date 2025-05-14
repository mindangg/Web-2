import React, { useState } from "react";
import "../styles/Cart/Payment.css";
import PaymentInfoUser from "../components/cart/PaymentInfoUser";
import PaymentInfoProduct from "../components/cart/PaymentInfoProduct";
import OrderPreview from "../components/cart/OrderPreview";
import { Link, useNavigate } from "react-router-dom";
import { useCartContext } from "../hooks/useCartContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNotificationContext } from '../hooks/useNotificationContext';

function Payment() {
    const { cart, dispatch } = useCartContext();
    const { user } = useAuthContext();
    const { showNotification } = useNotificationContext();
    const navigate = useNavigate();
    const [showPreview, setShowPreview] = useState(false);
    const [orderData, setOrderData] = useState(null);

    const handleCompleteOrder = async () => {
        // Kiểm tra dữ liệu
        if (!user) {
            showNotification("Vui lòng đăng nhập để đặt hàng");
            return;
        }

        if (cart.length === 0) {
            showNotification("Giỏ hàng trống");
            return;
        }

        const paymentInfoUser = document.querySelector(".info-user");
        const selectedAddressId = paymentInfoUser.dataset.selectedAddressId || null;
        const paymentMethod = paymentInfoUser.dataset.paymentMethod || "direct_payment";

        if (!selectedAddressId) {
            showNotification("Vui lòng chọn địa chỉ giao hàng");
            return;
        }

        // Lấy thông tin địa chỉ từ danh sách địa chỉ
        try {
            const response = await fetch(
                `http://localhost/api/user/addresses/${user.user.user_account_id}`,
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );
            const addresses = await response.json();
            const selectedAddress = addresses.find(addr => addr.user_information_id === selectedAddressId);

            if (!selectedAddress) {
                showNotification("Địa chỉ không hợp lệ");
                return;
            }

            // Chuẩn bị dữ liệu xem trước
            const totalPrice = cart.reduce((sum, item) => sum + (item.invoice_price * item.quantity), 0);
            const previewData = {
                user_information: selectedAddress,
                payment_method: paymentMethod,
                items: cart.map(item => ({
                    sku_id: item.sku_id,
                    sku_name: item.sku_name,
                    quantity: item.quantity,
                    price: item.invoice_price
                })),
                totalPrice: totalPrice,
                account_id: user.user.user_account_id,
                user_information_id: selectedAddressId
            };

            setOrderData(previewData);
            setShowPreview(true);
        } catch (error) {
            console.error("Lỗi khi lấy thông tin địa chỉ:", error);
            showNotification("Có lỗi xảy ra khi lấy thông tin địa chỉ");
        }
    };

    const handleConfirmOrder = async () => {
        if (!orderData) return;

        const orderPayload = {
            account_id: orderData.account_id,
            user_information_id: orderData.user_information_id,
            payment_method: orderData.payment_method,
            items: orderData.items.map(item => ({
                sku_id: item.sku_id,
                quantity: item.quantity,
                price: item.price
            }))
        };

        try {
            const response = await fetch("http://localhost/api/receipt", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify(orderPayload),
            });

            const data = await response.json();
            if (response.ok) {
                // Xóa giỏ hàng
                localStorage.removeItem(`cart_${user.user.user_account_id}`);
                dispatch({ type: "CLEAR_ITEM" });

                showNotification("Đặt hàng thành công!");
                setShowPreview(false);
                navigate("/");
            } else {
                showNotification(`Lỗi: ${data.message || "Không thể tạo đơn hàng"}`);
            }
        } catch (error) {
            console.error("Lỗi khi tạo đơn hàng:", error);
            showNotification("Có lỗi xảy ra khi tạo đơn hàng");
        }
    };

    const handleCancelOrder = () => {
        setShowPreview(false);
        setOrderData(null);
    };

    return (
        <>
            <h2 id="h2">Giỏ hàng</h2>
            <div className="payment">
                <PaymentInfoUser />
                <PaymentInfoProduct />
                <button id="complete-btn" onClick={handleCompleteOrder}>HOÀN TẤT ĐẶT HÀNG</button>
                {showPreview && (
                    <OrderPreview
                        orderData={orderData}
                        onConfirm={handleConfirmOrder}
                        onCancel={handleCancelOrder}
                    />
                )}
            </div>
        </>
    );
}

export default Payment;