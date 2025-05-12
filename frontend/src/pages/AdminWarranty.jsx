import React, { useState, useEffect } from 'react';
import '../styles/Admin.css';
import { useAdminContext } from '../hooks/useAdminContext';
import { useNotificationContext } from '../hooks/useNotificationContext';
import { useSearchParams } from 'react-router-dom';
import CustomPagination from '../components/CustomPagination.jsx';

export default function AdminWarranty() {
  const { admin } = useAdminContext();
  const { showNotification } = useNotificationContext();
  const [warranties, setWarranties] = useState([]);
  const [filteredWarranties, setFilteredWarranties] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [imeiSearch, setImeiSearch] = useState('');
  const [skuNameSearch, setSkuNameSearch] = useState('');
  const [receiptIdSearch, setReceiptIdSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedWarranty, setSelectedWarranty] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams({ limit: '10' });

  useEffect(() => {
    const fetchWarranties = async () => {
      if (!admin || !admin.token) {
        setError('Không tìm thấy thông tin đăng nhập. Vui lòng đăng nhập lại.');
        setLoading(false);
        return;
      }

      try {
        const queryParams = new URLSearchParams({
          ...(statusFilter !== 'All' && { status: statusFilter }),
          ...(startDate && { start_date: startDate }),
          ...(endDate && { end_date: endDate }),
          ...(imeiSearch && { imei: imeiSearch }),
          ...(skuNameSearch && { sku_name: skuNameSearch }),
          ...(receiptIdSearch && { receipt_id: receiptIdSearch }),
          page: searchParams.get('page') || '1',
          limit: searchParams.get('limit') || '10',
        }).toString();

        const response = await fetch(`http://localhost/api/warranty?${queryParams}`, {
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
        setCurrentPage(data.currentPage || 1);
        setTotalPage(data.totalPage || 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWarranties();
  }, [admin, searchParams, statusFilter, startDate, endDate, imeiSearch, skuNameSearch, receiptIdSearch]);

  useEffect(() => {
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      showNotification('Ngày kết thúc không thể trước ngày bắt đầu', 'error');
      setEndDate('');
      return;
    }

    let filtered = warranties;

    if (statusFilter !== 'All') {
      filtered = filtered.filter((warranty) => warranty.status === statusFilter);
    }

    if (startDate) {
      filtered = filtered.filter(
        (warranty) => new Date(warranty.date) >= new Date(startDate)
      );
    }
    if (endDate) {
      filtered = filtered.filter(
        (warranty) => new Date(warranty.date) <= new Date(endDate)
      );
    }

    if (imeiSearch) {
      filtered = filtered.filter((warranty) =>
        warranty.imei.toString().includes(imeiSearch)
      );
    }
    if (skuNameSearch) {
      filtered = filtered.filter((warranty) =>
        warranty.sku_name.toLowerCase().includes(skuNameSearch.toLowerCase())
      );
    }
    if (receiptIdSearch) {
      filtered = filtered.filter((warranty) =>
        warranty.receipt_detail_id.toString().includes(receiptIdSearch)
      );
    }

    setFilteredWarranties(filtered);
  }, [statusFilter, startDate, endDate, imeiSearch, skuNameSearch, receiptIdSearch, warranties, showNotification]);

  const handleRefresh = () => {
    setStartDate('');
    setEndDate('');
    setStatusFilter('All');
    setImeiSearch('');
    setSkuNameSearch('');
    setReceiptIdSearch('');
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
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Không thể cập nhật trạng thái bảo hành');
      }
      setWarranties(warranties.map((w) =>
        w.imei === warrantyId ? { ...w, status: newStatus } : w
      ));
      setFilteredWarranties(filteredWarranties.map((w) =>
        w.imei === warrantyId ? { ...w, status: newStatus } : w
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
            className='warranty-search-imei'
            type="text"
            placeholder="Tìm theo IMEI..."
            value={imeiSearch}
            onChange={(e) => setImeiSearch(e.target.value)}
          />
          <i className="fa-solid fa-magnifying-glass"></i>
        </div>

        <div className="warranty-search-name">
          <input
            type="text"
            placeholder="Tìm theo tên sản phẩm..."
            value={skuNameSearch}
            onChange={(e) => setSkuNameSearch(e.target.value)}
          />
          <i className="fa-solid fa-magnifying-glass"></i>
        </div>

        <div className="warranty-search-receipt">
          <input
            type="text"
            placeholder="Tìm theo mã đơn hàng..."
            value={receiptIdSearch}
            onChange={(e) => setReceiptIdSearch(e.target.value)}
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
          min={startDate || undefined}
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
              <i
                className="fa-solid fa-eye"
                onClick={() => setSelectedWarranty(warranty)}
              ></i>
            </span>
          </div>
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

      {selectedWarranty && (
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
                  <p><strong>Địa chỉ:</strong> {selectedWarranty.user_info.house_number}, {selectedWarranty.user_info.street}, {selectedWarranty.user_info.ward}, {selectedWarranty.user_info.district}, {selectedWarranty.user_info.city}</p>
                </>
              )}
            </div>
            <div className="warranty-actions">
              {selectedWarranty.status !== 'Hết hạn' && (
                <button
                  className="button"
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
      )}
    </div>
  );
}