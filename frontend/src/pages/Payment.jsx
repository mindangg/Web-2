import React from "react";
import "../styles/Cart/Payment.css"
import PaymentInfoUser from "../components/cart/PaymentInfoUser";
import { Link,useNavigate } from "react-router-dom";
import PaymentInfoProduct from "../components/cart/PaymentInfoProduct";
import { useCartContext } from "../hooks/useCartContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNotificationContext } from '../hooks/useNotificationContext'
function Payment(){
    const { cart, dispatch } = useCartContext();
    const { user } = useAuthContext();
    const { showNotification } = useNotificationContext()
    const navigate = useNavigate();

    //Can xem lai
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

        // Lấy thông tin địa chỉ từ PaymentInfoUser
        const paymentInfoUser = document.querySelector(".info-user");
        const selectedAddressId = paymentInfoUser.dataset.selectedAddressId || null;
        const paymentMethod = paymentInfoUser.dataset.paymentMethod || "direct_payment";

        if (!selectedAddressId) {
            showNotification("Vui lòng chọn địa chỉ giao hàng");
            return;
        }

        // Chuẩn bị dữ liệu đơn hàng
        const orderData = {
            account_id: user.user.user_account_id,
            user_information_id: selectedAddressId,
            payment_method: paymentMethod,
            items: cart.map(item => ({
                sku_id: item.sku_id,
                quantity: item.quantity,
                price: item.invoice_price
            }))
        };

        try {
            const response = await fetch("http://localhost/api/receipt", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify(orderData),
            });

            const data = await response.json();
            if (response.ok) {
                // Xóa giỏ hàng
                localStorage.removeItem(`cart_${user.user.user_account_id}`);
                dispatch({ type: "CLEAR_ITEM" });

                showNotification("Đặt hàng thành công!");
                navigate("/order-confirmation"); // Điều hướng đến trang xác nhận đơn hàng
            } else {
                showNotification(`Lỗi: ${data.message || "Không thể tạo đơn hàng"}`);
            }
        } catch (error) {
            console.error("Lỗi khi tạo đơn hàng:", error);
            showNotification("Có lỗi xảy ra khi tạo đơn hàng");
        }
    };

    return(
        <>
            <h2 id="h2">Giỏ hàng</h2>
            <div className="payment">
                <PaymentInfoUser/>
                <PaymentInfoProduct/>
                    <button id="complete-btn" onClick={handleCompleteOrder}>HOÀN TẤT ĐẶT HÀNG</button>
            </div>
        </>
    );
}export default Payment