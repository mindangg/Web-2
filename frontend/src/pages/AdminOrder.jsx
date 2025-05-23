import React, { useEffect, useState } from 'react';
import '../styles/Admin.css';
import OrderCard from '../components/Admin/OrderCard';
import { useAdminContext } from '../hooks/useAdminContext';
import { useNotificationContext } from '../hooks/useNotificationContext';
import { useSearchParams } from 'react-router-dom';
import CustomPagination from '../components/CustomPagination.jsx';

export default function AdminOrder() {
    const { admin } = useAdminContext();
    const { showNotification } = useNotificationContext();
    const [receipts, setReceipts] = useState([]);
    const [filteredReceipts, setFilteredReceipts] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [district, setDistrict] = useState('');
    const [city, setCity] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [searchParams, setSearchParams] = useSearchParams({ limit: '10' });

    const hasAccess = (functionName, action) => {
        const functions = admin?.employee?.[0]?.role?.functions || []
        const matchedFunc = functions.find(f => f.function_name === functionName)
        return matchedFunc?.actions?.includes(action)
    }

    const hasPermission = (action) => {
        return hasAccess("Đơn hàng", action)
    }

    useEffect(() => {
        const fetchReceipts = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/receipt', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${admin.token}`,
                    },
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.error || 'Không thể tải danh sách đơn hàng');
                }
                setReceipts(data.receipts || []);
                setFilteredReceipts(data.receipts || []);
                setCurrentPage(data.currentPage || 1);
                setTotalPage(data.totalPage || 0);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReceipts();
    }, [admin.token, searchParams]);

    useEffect(() => {
        let filtered = receipts;

        // Kiểm tra ngày bắt đầu và ngày kết thúc
        if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
            showNotification('Ngày bắt đầu không thể lớn hơn ngày kết thúc', 'error');
            return;
        }

        // Lọc theo trạng thái
        if (statusFilter !== 'All') {
            filtered = filtered.filter((receipt) => receipt.status === statusFilter.toLowerCase());
        }

        // Lọc theo khoảng thời gian
        if (startDate) {
            filtered = filtered.filter(
                (receipt) => new Date(receipt.created_at) >= new Date(startDate)
            );
        }
        if (endDate) {
            filtered = filtered.filter(
                (receipt) => new Date(receipt.created_at) <= new Date(endDate)
            );
        }

        // Lọc theo quận/huyện
        if (district) {
            filtered = filtered.filter(
                (receipt) => receipt.user_information?.district.toLowerCase().includes(district.toLowerCase())
            );
        }

        // Lọc theo thành phố
        if (city) {
            filtered = filtered.filter(
                (receipt) => receipt.user_information?.city.toLowerCase().includes(city.toLowerCase())
            );
        }

        setFilteredReceipts(filtered);
    }, [statusFilter, startDate, endDate, district, city, receipts, showNotification]);

    const handleRefresh = () => {
        setStartDate('');
        setEndDate('');
        setStatusFilter('All');
        setDistrict('');
        setCity('');
        setFilteredReceipts(receipts);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    if (loading) return <div className="order-container">Đang tải...</div>;
    if (error) return <div className="order-container">Lỗi: {error}</div>;

    return (
        <div className="order-container">
            <div className="order-controller">
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="All">Tất cả</option>
                    <option value="Pending">Chờ xử lý</option>
                    <option value="Confirmed">Đã xác nhận</option>
                    <option value="On_deliver">Đang giao</option>
                    <option value="Delivered">Đã giao</option>
                    <option value="Cancelled">Đã hủy</option>
                </select>

                <div className="order-search">
                    <input
                        className='order-search-district'
                        type="text"
                        placeholder="Tìm theo quận/huyện..."
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                    />
                    <i className="fa-solid fa-magnifying-glass"></i>
                </div>

                <div className="order-search">
                    <input
                        className='order-search-city'
                        type="text"
                        placeholder="Tìm theo thành phố..."
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
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

                <div className="order-icon">
                    <button onClick={handleRefresh}>
                        <i className="fa-solid fa-rotate-right"></i> Làm mới
                    </button>
                </div>
            </div>

            <div className="order-header">
                <span>Đơn hàng</span>
                <span>Khách hàng</span>
                <span>Ngày đặt</span>
                <span>Tổng tiền</span>
                <span>Tình trạng</span>
                <span>Chi tiết</span>
            </div>

            {filteredReceipts.length === 0 ? (
                <div>Không có đơn hàng phù hợp.</div>
            ) : (
                filteredReceipts.map((receipt) => (
                    <OrderCard
                        hasPermission={hasPermission}
                        key={receipt.receipt_id}
                        receipt={receipt}
                        onViewDetails={() => setSelectedReceipt(receipt)}
                    />
                ))
            )}

            {totalPage > 1 && (
                <CustomPagination
                    totalPage={totalPage}
                    currentPage={currentPage}
                    searchParams={searchParams}
                    setSearchParams={setSearchParams}
                />
            )}

            {selectedReceipt && (
                <div className={'history'}>
                    <div className="modal open">
                        <div className="modal-content">
                            <h2>Chi tiết đơn hàng #{selectedReceipt.receipt_id}</h2>
                            <div className="history-user-info">
                                <h3>Thông tin người nhận</h3>
                                <p><strong>Họ tên:</strong> {selectedReceipt.user_information?.full_name || 'Không xác định'}</p>
                                <p><strong>Số điện thoại:</strong> {selectedReceipt.user_information?.phone_number || 'Không xác định'}</p>
                                <p><strong>Địa chỉ giao hàng:</strong>
                                    {selectedReceipt.user_information
                                        ? `${selectedReceipt.user_information.house_number}, ${selectedReceipt.user_information.street}, ${selectedReceipt.user_information.ward}, ${selectedReceipt.user_information.district}, ${selectedReceipt.user_information.city}`
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
                                                <img src={`./product/${detail.image}`} alt={detail.sku_name} style={{ maxWidth: '50px' }} />
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
}