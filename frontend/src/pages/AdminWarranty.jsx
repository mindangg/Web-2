import React, {useEffect, useState} from 'react';
import '../styles/Admin.css';
import {useAdminContext} from '../hooks/useAdminContext';
import {Button} from "react-bootstrap";

export default function AdminWarranty() {
    const {admin} = useAdminContext();
    const [warranties, setWarranties] = useState([]);
    const [filteredWarranties, setFilteredWarranties] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedWarranty, setSelectedWarranty] = useState(null);
    const hasAccess = (functionName, action) => {
        const functions = admin?.employee?.[0]?.role?.functions || []
        const matchedFunc = functions.find(f => f.function_name === functionName)
        return matchedFunc?.actions?.includes(action)
    }

    const hasPermission = (action) => {
        return hasAccess("Bảo hành", action)
    }

    useEffect(() => {
        const fetchWarranties = async () => {
            if (!admin || !admin.token) {
                setError('Không tìm thấy thông tin đăng nhập. Vui lòng đăng nhập lại.');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('http://localhost/api/warranty', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${admin.token}`,
                    },
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.error || 'Không thể tải danh sách bảo hành');
                }
                setWarranties(data.warranties || []);
                setFilteredWarranties(data.warranties || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWarranties();
    }, [admin]);

    useEffect(() => {
        let filtered = warranties;

        if (statusFilter !== 'All') {
            filtered = filtered.filter((warranty) => warranty.status === statusFilter);
        }

        if (startDate) {
            filtered = filtered.filter(
                (warranty) => new Date(warranty.date),

                filtered = filtered.filter(
                    (warranty) => new Date(warranty.date) >= new Date(startDate)
                ))
        }
        if (endDate) {
            filtered = filtered.filter(
                (warranty) => new Date(warranty.date) <= new Date(endDate)
            );
        }

        if (searchQuery) {
            filtered = filtered.filter(
                (warranty) =>
                    warranty.imei.toString().includes(searchQuery) ||
                    warranty.sku_name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredWarranties(filtered);
    }, [statusFilter, startDate, endDate, searchQuery, warranties]);

    const handleRefresh = () => {
        setStartDate('');
        setEndDate('');
        setStatusFilter('All');
        setSearchQuery('');
        setFilteredWarranties(warranties);
    };

    const handleStatusUpdate = async (warrantyId, newStatus) => {
        if (!admin || !admin.token) {
            setError('Không tìm thấy thông tin đăng nhập. Vui lòng đăng nhập lại.');
            return;
        }

        try {
            const response = await fetch(`http://localhost/api/warranty/${parseInt(warrantyId)}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${admin.token}`,
                },
                body: JSON.stringify({status: newStatus}),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Không thể cập nhật trạng thái bảo hành');
            }
            setWarranties(warranties.map((w) =>
                w.imei === warrantyId ? {...w, status: newStatus} : w
            ));
            setFilteredWarranties(filteredWarranties.map((w) =>
                w.imei === warrantyId ? {...w, status: newStatus} : w
            ));
            setSelectedWarranty(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    if (!admin) {
        return <div className="warranty-container">Vui lòng đăng nhập để xem bảo hành.</div>;
    }

    if (loading) return <div className="warranty-container">Đang tải...</div>;
    if (error) return <div className="warranty-container">Lỗi: {error}</div>;

    return (
        <div className="warranty-container">
            <div className="warranty-controller">
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="All">Tất cả</option>
                    <option value="Hoạt động">Hoạt động</option>
                    <option value="Đang bảo hành">Đang bảo hành</option>
                    <option value="Hết hạn">Hết hạn</option>
                </select>

                <div className="warranty-search">
                    <input
                        type="text"
                        placeholder="Tìm theo IMEI hoặc tên sản phẩm..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <i className="fa-solid fa-magnifying-glass"></i>
                </div>

                <label>Từ</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />

                <label>Đến</label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />

                <div className="warranty-icon">
                    <button onClick={handleRefresh}>
                        <i className="fa-solid fa-rotate-right"></i> Làm mới
                    </button>
                </div>
            </div>

            <div className="warranty-header">
                <span>IMEI</span>
                <span>Sản phẩm</span>
                <span>Ngày kích hoạt</span>
                <span>Ngày hết hạn</span>
                <span>Trạng thái</span>
                <span>Chi tiết</span>
            </div>

            {filteredWarranties.length === 0 ? (
                <div>Không có bản ghi bảo hành phù hợp.</div>
            ) : (
                filteredWarranties.map((warranty) => (
                    <div className="warranty-info" key={warranty.imei}>
                        <span>{warranty.imei}</span>
                        <span>{warranty.sku_name}</span>
                        <span>{formatDate(warranty.date)}</span>
                        <span>{formatDate(warranty.expired_date)}</span>
                        <span className={
                            warranty.status === 'Hoạt động' ? 'warranty-status-active' :
                                warranty.status === 'Đang bảo hành' ? 'warranty-status-repairing' :
                                    'warranty-status-inactive'
                        }>
                            {warranty.status}
                        </span>
                        <span className="warranty-action">
                            {hasPermission("Xem") && (<Button
                                variant="info"
                                onClick={() => setSelectedWarranty(warranty)}
                            >
                                <i className='fa-solid fa-eye'></i>
                            </Button>)}
                        </span>
                    </div>
                ))
            )}

            {selectedWarranty && (
                <div className={'warranty'}>
                    <div className="modal open">
                        <div className="modal-content">
                            <h2>Chi tiết bảo hành #{selectedWarranty.imei}</h2>
                            <div className="warranty-details">
                                <p><strong>IMEI:</strong> {selectedWarranty.imei}</p>
                                <p><strong>Sản phẩm:</strong> {selectedWarranty.sku_name}</p>
                                <p><strong>Đơn hàng:</strong> #{selectedWarranty.receipt_detail_id}</p>
                                <p><strong>Ngày kích hoạt:</strong> {formatDate(selectedWarranty.date)}</p>
                                <p><strong>Ngày hết hạn:</strong> {formatDate(selectedWarranty.expired_date)}</p>
                                <p><strong>Trạng thái:</strong> {selectedWarranty.status}</p>
                                {selectedWarranty.user_info && (
                                    <>
                                        <p><strong>Người mua:</strong> {selectedWarranty.user_info.full_name}</p>
                                        <p><strong>Số điện thoại:</strong> {selectedWarranty.user_info.phone_number}</p>
                                        <p><strong>Địa
                                            chỉ:</strong> {selectedWarranty.user_info.house_number}, {selectedWarranty.user_info.street}, {selectedWarranty.user_info.ward}, {selectedWarranty.user_info.district}, {selectedWarranty.user_info.city}
                                        </p>
                                    </>
                                )}
                            </div>
                            <div className="warranty-actions">
                                {selectedWarranty.status !== 'Hết hạn' && (
                                    <button
                                        className="button"
                                        disabled={!hasPermission("Sửa")}
                                        onClick={() => handleStatusUpdate(selectedWarranty.imei, selectedWarranty.status === 'Hoạt động' ? 'Đang bảo hành' : 'Hoạt động')}
                                    >
                                        {selectedWarranty.status === 'Hoạt động' ? 'Chuyển sang Đang bảo hành' : 'Chuyển sang Hoạt động'}
                                    </button>
                                )}
                                <button
                                    className="button close-button"
                                    onClick={() => setSelectedWarranty(null)}
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}