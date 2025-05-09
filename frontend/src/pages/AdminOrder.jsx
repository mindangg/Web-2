import React, { useState, useEffect } from 'react';
import '../styles/Admin.css';
import OrderCard from '../components/Admin/OrderCard';
import { useAdminContext } from '../hooks/useAdminContext';

export default function AdminOrder() {
  const {admin} = useAdminContext();
  const [receipts, setReceipts] = useState([]);
  const [filteredReceipts, setFilteredReceipts] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [district, setDistrict] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const response = await fetch('http://localhost/api/receipt', {
          headers: {
            'Content-Type': 'application/json',
            // Giả định có token admin trong localStorage
            'Authorization': `Bearer ${admin.token}`,
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Không thể tải danh sách đơn hàng');
        }
        setReceipts(data.receipts || []);
        setFilteredReceipts(data.receipts || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReceipts();
  }, []);

  useEffect(() => {
    let filtered = receipts;

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

    setFilteredReceipts(filtered);
  }, [statusFilter, startDate, endDate, district, receipts]);

  const handleRefresh = () => {
    setStartDate('');
    setEndDate('');
    setStatusFilter('All');
    setDistrict('');
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
          <option value="On deliver">Đang giao</option>
          <option value="Delivered">Đã giao</option>
          <option value="Cancelled">Đã hủy</option>
        </select>

        <div className="order-search">
          <input
            type="text"
            placeholder="Tìm theo quận/huyện..."
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
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
            key={receipt.receipt_id}
            receipt={receipt}
            onViewDetails={() => setSelectedReceipt(receipt)}
          />
        ))
      )}

      {selectedReceipt && (
        <div className="modal open">
          <div className="modal-content">
            <h2>Chi tiết đơn hàng #{selectedReceipt.receipt_id}</h2>
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
                        <img src={detail.image} alt={detail.sku_name} style={{ maxWidth: '50px' }} />
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
      )}
    </div>
  );
}