import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import '../styles/OrderHistory.css';

const OrderHistory = () => {
  const { user } = useAuthContext();
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
          `http://localhost/api/receipt?account_id=${user.user.user_account_id}`,
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
        body: JSON.stringify({ status: 'cancelled' }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Không thể hủy đơn hàng');
      }

      setReceipts((prev) =>
        prev.map((receipt) =>
          receipt.receipt_id === receiptId
            ? { ...receipt, status: 'cancelled' }
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
              <td>{receipt.status}</td>
              <td>{receipt.payment_method}</td>
              <td>
                <button
                  className="button"
                  onClick={() => setSelectedReceipt(receipt)}
                >
                  Xem chi tiết
                </button>
                {['pending', 'confirmed'].includes(receipt.status) && (
                  <button
                    className="button cancel-button"
                    onClick={() => handleCancelOrder(receipt.receipt_id, receipt.status)}
                    style={{ backgroundColor: '#dc3545', marginLeft: '5px' }}
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
                        <img src={detail.image} alt={detail.sku_name} />
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
};

export default OrderHistory;