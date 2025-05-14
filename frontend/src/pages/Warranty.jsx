import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import '../styles/Warranty.css';

const Warranty = () => {
    const { user } = useAuthContext();
    const [warranties, setWarranties] = useState([]);
    const [selectedWarranty, setSelectedWarranty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user?.user?.user_account_id) {
            setError('Vui lòng đăng nhập để xem thông tin bảo hành');
            setLoading(false);
            return;
        }

        const fetchWarranties = async () => {
            setError(null);
            try {
                const response = await fetch(
                    `http://localhost/api/warranty?account_id=${user.user.user_account_id}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${user.token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.error || 'Không thể tải danh sách bảo hành');
                }
                setWarranties(data.warranties || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWarranties();
    }, [user]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const statusDisplay = {
        'Hoạt động': 'Hoạt động',
        'Đang bảo hành': 'Đang bảo hành',
        'Hết hạn': 'Hết hạn',
    };

    if (loading) return <div className="container">Đang tải...</div>;
    if (error) return <div className="container">Lỗi: {error}</div>;
    if (warranties.length === 0 && !error)
        return <div className="container">Không có thông tin bảo hành nào.</div>;

    return (
        <div className="container">
            <h1>Thông tin bảo hành</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>IMEI</th>
                        <th>Tên sản phẩm</th>
                        <th>Ngày mua</th>
                        <th>Ngày hết hạn</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {warranties.map((warranty) => (
                        <tr key={warranty.imei}>
                            <td>{warranty.imei}</td>
                            <td>{warranty.sku_name || 'Không xác định'}</td>
                            <td>{formatDate(warranty.date)}</td>
                            <td>{formatDate(warranty.expired_date)}</td>
                            <td className={`warranty-status-${warranty.status.replace(' ', '_')}`}>
                                {statusDisplay[warranty.status] || warranty.status}
                            </td>
                            <td>
                                <button
                                    className="button view-button"
                                    onClick={() => setSelectedWarranty(warranty)}
                                >
                                    Xem chi tiết
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {selectedWarranty && (
                <div className="history">
                    <div className="modal open">
                        <div className="modal-content">
                            <h2>Chi tiết bảo hành #{selectedWarranty.imei}</h2>
                            <div className="warranty-user-info">
                                <h3>Thông tin người dùng</h3>
                                <p>
                                    <strong>Họ tên:</strong>{' '}
                                    {selectedWarranty.user_info?.full_name || 'Không xác định'}
                                </p>
                                <p>
                                    <strong>Số điện thoại:</strong>{' '}
                                    {selectedWarranty.user_info?.phone_number || 'Không xác định'}
                                </p>
                                <p>
                                    <strong>Địa chỉ:</strong>{' '}
                                    {selectedWarranty.user_info
                                        ? [
                                              selectedWarranty.user_info.house_number,
                                              selectedWarranty.user_info.street,
                                              selectedWarranty.user_info.ward,
                                              selectedWarranty.user_info.district,
                                              selectedWarranty.user_info.city,
                                          ]
                                              .filter((part) => part)
                                              .join(', ') || 'Không xác định'
                                        : 'Không xác định'}
                                </p>
                            </div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>IMEI</th>
                                        <th>Tên sản phẩm</th>
                                        <th>Ngày mua</th>
                                        <th>Ngày hết hạn</th>
                                        <th>Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{selectedWarranty.imei}</td>
                                        <td>{selectedWarranty.sku_name || 'Không xác định'}</td>
                                        <td>{formatDate(selectedWarranty.date)}</td>
                                        <td>{formatDate(selectedWarranty.expired_date)}</td>
                                        <td>{statusDisplay[selectedWarranty.status] || selectedWarranty.status}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <button
                                className="button close-button"
                                onClick={() => setSelectedWarranty(null)}
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

export default Warranty;