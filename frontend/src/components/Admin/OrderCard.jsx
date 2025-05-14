import React, {useState} from 'react';

import '../../styles/Admin.css';
import {useAdminContext} from '../../hooks/useAdminContext';
import {Button} from "react-bootstrap";

export default function OrderCard({hasPermission, receipt, onViewDetails}) {
    const [status, setStatus] = useState(receipt.status);
    const {admin} = useAdminContext();

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

    const statusOptions = ['pending', 'confirmed', 'on_deliver', 'delivered', 'cancelled'];
    const statusDisplay = {
        pending: 'Chờ xử lý',
        confirmed: 'Đã xác nhận',
        on_deliver: 'Đang giao',
        delivered: 'Đã giao',
        cancelled: 'Đã hủy',
    };

    const handleStatusChange = async (newStatus) => {
        // Kiểm tra logic cập nhật xuôi
        const currentIndex = statusOptions.indexOf(status);
        const newIndex = statusOptions.indexOf(newStatus);

        if (newIndex < currentIndex && newStatus !== 'cancelled') {
            alert('Không thể cập nhật trạng thái ngược lại!');
            return;
        }

        if (newStatus === 'cancelled' && !['pending', 'confirmed'].includes(status)) {
            alert('Chỉ có thể hủy đơn hàng ở trạng thái Chờ xử lý hoặc Đã xác nhận!');
            return;
        }

        try {
            const response = await fetch(`http://localhost/api/receipt/${receipt.receipt_id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${admin.token}`,
                },
                body: JSON.stringify({status: newStatus}),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Không thể cập nhật trạng thái');
            }
            setStatus(newStatus);
        } catch (err) {
            alert(`Lỗi: ${err.message}`);
        }
    };

    return (
        <div className="order-info">
            <span>{receipt.receipt_id}</span>
            <span>{receipt.user_information?.full_name || 'Không xác định'}</span>
            <span>{formatDate(receipt.created_at)}</span>
            <span>{formatPrice(receipt.total_price)}</span>
            <select
                className={`order-status-${status}`}
                value={status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={!hasPermission("Sửa") || status === 'cancelled' || status === 'delivered'}
            >
                {statusOptions.map((opt) => (
                    <option key={opt} value={opt}>
                        {statusDisplay[opt]}
                    </option>
                ))}
            </select>
            <span className="order-action" onClick={onViewDetails}>
                {hasPermission("Xem") && (<Button
                    variant="info"
                >
                    <i className='fa-solid fa-eye m-0'></i>
                </Button>)}
            </span>
        </div>
    );
}
