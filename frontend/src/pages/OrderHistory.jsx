import React, {useEffect, useState} from 'react';
import {useAuthContext} from '../hooks/useAuthContext';
import '../styles/OrderHistory.css';

const OrderHistory = () => {
    const {user} = useAuthContext();
    const [receipts, setReceipts] = useState([]);
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user?.user?.user_account_id) {
            setError('Vui lòng đăng nhập để xem lịch sử đơn hàng');
            setLoading(false);
            return;
        }

        const fetchReceipts = async () => {
            setError(null);
            try {
                const response = await fetch(
                    `http://localhost:8080/api/receipt?account_id=${user.user.user_account_id}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${user.token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.error || 'Không thể tải danh sách đơn hàng');
                }
                setReceipts(data.receipts || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReceipts();
    }, [user]);

    const handleCancelOrder = async (receiptId, currentStatus) => {
        if (!['pending', 'confirmed'].includes(currentStatus)) {
            alert('Chỉ có thể hủy đơn hàng ở trạng thái Chờ xử lý hoặc Đã xác nhận!');
            return;
        }

        try {
            const response = await fetch(`http://localhost/api/receipt/${receiptId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`,
                },
                body: JSON.stringify({status: 'cancelled'}),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Không thể hủy đơn hàng');
            }

            setReceipts((prev) =>
                prev.map((receipt) =>
                    receipt.receipt_id === receiptId
                        ? {...receipt, status: 'cancelled'}
                        : receipt
                )
            );
            alert('Hủy đơn hàng thành công!');
        } catch (err) {
            alert(`Lỗi: ${err.message}`);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    const statusDisplay = {
        pending: 'Chờ xử lý',
        confirmed: 'Đã xác nhận',
        on_deliver: 'Đang giao',
        delivered: 'Đã giao',
        cancelled: 'Đã hủy',
    };

    const paymentMethodDisplay = {
        direct_payment: 'Thanh toán trực tiếp',
        transfer_payment: 'Chuyển khoản ngân hàng',
    };

    if (loading) return <div className="container">Đang tải...</div>;
    if (error) return <div className="container">Lỗi: {error}</div>;
    if (receipts.length === 0 && !error)
        return <div className="container">Không có đơn hàng nào.</div>;

    return (
        <div className="container">
            <h1>Lịch sử đơn hàng</h1>
            <table className="table">
                <thead>
                <tr>
                    <th>Mã đơn hàng</th>
                    <th>Ngày đặt</th>
                    <th>Tổng giá</th>
                    <th>Trạng thái</th>
                    <th>Phương thức thanh toán</th>
                    <th>Hành động</th>
                </tr>
                </thead>
                <tbody>
                {receipts.map((receipt) => (
                    <tr key={receipt.receipt_id}>
                        <td>{receipt.receipt_id}</td>
                        <td>{formatDate(receipt.created_at)}</td>
                        <td>{formatPrice(receipt.total_price)}</td>
                        <td className={`order-status-${receipt.status}`}>
                            {statusDisplay[receipt.status] || receipt.status}
                        </td>
                        <td>{paymentMethodDisplay[receipt.payment_method] || receipt.payment_method}</td>
                        <td>
                            <button
                                className="button view-button"
                                onClick={() => setSelectedReceipt(receipt)}
                            >
                                Xem chi tiết
                            </button>
                            {['pending', 'confirmed'].includes(receipt.status) && (
                                <button
                                    className="button cancel-button"
                                    onClick={() => handleCancelOrder(receipt.receipt_id, receipt.status)}
                                >
                                    Hủy đơn
                                </button>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {selectedReceipt && (
                <div className={`history`}>
                    <div className="modal open">
                        <div className="modal-content">
                            <h2>Chi tiết đơn hàng #{selectedReceipt.receipt_id}</h2>
                            <div className="history-user-info">
                                <h3>Thông tin người nhận</h3>
                                <p><strong>Họ
                                    tên:</strong> {selectedReceipt.user_information?.full_name || 'Không xác định'}</p>
                                <p><strong>Số điện
                                    thoại:</strong> {selectedReceipt.user_information?.phone_number || 'Không xác định'}
                                </p>
                                <p><strong>Địa chỉ giao hàng:</strong>
                                    {selectedReceipt.user_information
                                        ? [
                                        selectedReceipt.user_information.house_number,
                                        selectedReceipt.user_information.street,
                                        selectedReceipt.user_information.ward,
                                        selectedReceipt.user_information.district,
                                        selectedReceipt.user_information.city
                                    ]
                                        .filter(part => part)
                                        .join(', ') || 'Không xác định'
                                        : 'Không xác định'}
                                </p>
                            </div>
                            <table>
                                <thead>
                                <tr>
                                    <th>Hình ảnh</th>
                                    <th>Tên sản phẩm</th>
                                    <th>Số lượng</th>
                                    <th>Giá</th>
                                </tr>
                                </thead>
                                <tbody>
                                {Array.isArray(selectedReceipt.details) && selectedReceipt.details.length > 0 ? (
                                    selectedReceipt.details.map((detail) => (
                                        <tr key={detail.detail_id}>
                                            <td>
                                                <img src={`./product/${detail.image}`} alt={detail.sku_name}/>
                                            </td>
                                            <td>{detail.sku_name}</td>
                                            <td>{detail.quantity}</td>
                                            <td>{formatPrice(detail.price)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4">Không có chi tiết đơn hàng</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                            <button
                                className="button close-button"
                                onClick={() => setSelectedReceipt(null)}
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderHistory;