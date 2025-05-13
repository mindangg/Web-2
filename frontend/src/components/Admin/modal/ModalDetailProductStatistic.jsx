import {useEffect, useState} from 'react';
import {Button, Modal, Tab, Table, Tabs} from "react-bootstrap";
import {useAdminContext} from "../../../hooks/useAdminContext.jsx";
import {API_URL, PRODUCT_IMAGE_PATH} from "../../../utils/Constant.jsx";

const ModalDetailProductStatistic = ({show, onClose, selectedProduct}) => {
    const [showReceiptDetail, setShowReceiptDetail] = useState(false);
    const [showImportDetail, setShowImportDetail] = useState(false);
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const [selectedImport, setSelectedImport] = useState(null);
    const [receiptData, setReceiptData] = useState([]);
    const [importData, setImportData] = useState([]);
    const [receiptDetails, setReceiptDetails] = useState([]);
    const [importDetails, setImportDetails] = useState([]);
    const {admin} = useAdminContext()

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        const fetchReceiptData = async () => {
            try {
                const response = await fetch(`${API_URL}statistic/product-detail`, {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${admin.token}`
                    },
                    signal: signal,
                    body: JSON.stringify(selectedProduct)
                });
                const data = await response.json();
                if (data.status === 200) {
                    setReceiptData(data.receipt);
                    setImportData(data.import);
                } else {
                    console.error(data.message);
                }
            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error("Error fetching receipt data:", error);
                }
            }
        }
        fetchReceiptData();
        return () => {
            controller.abort();
        }
    }, [selectedProduct]);

    useEffect(() => {
        if (selectedReceipt === null)
            return
        const controller = new AbortController();
        const signal = controller.signal;
        const fetchReceiptDetails = async () => {
            try {
                const response = await fetch(`${API_URL}receipt/${selectedReceipt.receipt_id}`, {
                    method: "GET",
                    headers: {
                        'Authorization': `Bearer ${admin.token}`
                    },
                    signal: signal
                });
                const data = await response.json();
                setReceiptDetails(data.details);
            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error("Error fetching receipt details:", error);
                }
            }
        }
        fetchReceiptDetails()
        return () => {
            controller.abort();
        }

    }, [selectedReceipt])

    useEffect(() => {
        if (selectedImport === null)
            return
        const controller = new AbortController();
        const signal = controller.signal;
        const fetchImportDetails = async () => {
            try {
                const response = await fetch(`${API_URL}import/${selectedImport.import_id}`, {
                    method: "GET",
                    headers: {
                        'Authorization': `Bearer ${admin.token}`
                    },
                    signal: signal
                });
                const data = await response.json();
                if (data.status === 200) {
                    setImportDetails(data.import_details);
                } else {
                    console.error(data.message);
                }
            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error("Error fetching import details:", error);
                }
            }
        }
        fetchImportDetails()
        return () => {
            controller.abort();
        }
    }, [selectedImport])

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const handleViewReceiptDetail = (receipt) => {
        setSelectedReceipt(receipt);
        setShowReceiptDetail(true);
    };

    const handleViewImportDetail = (importItem) => {
        setSelectedImport(importItem);
        setShowImportDetail(true);
    };

    return (
        <>
            <Modal show={show} onClose={onClose} onHide={onClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title className="text-center w-100">
                        <h3>
                            {selectedProduct?.sku_name || "Chi tiết sản phẩm"}
                        </h3>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Tabs
                        defaultActiveKey="hdban"
                        id="product-statistic-tabs"
                        className="w-100 mb-4 text-center"
                        style={{backgroundColor: 'lightgray', borderRadius: '5px'}}
                        justify
                    >
                        <Tab
                            title={'Hóa đơn bán'}
                            eventKey={'hdban'}
                            style={{borderRadius: '5px', padding: '15px 0'}}
                        >
                            <div className="p-3">
                                <h4 className="mb-3">Danh sách hóa đơn bán</h4>
                                <Table striped bordered hover responsive>
                                    <thead className="bg-primary text-white">
                                    <tr>
                                        <th>Mã HĐ</th>
                                        <th>Khách hàng</th>
                                        <th>Ngày tạo</th>
                                        <th>Tổng tiền</th>
                                        <th>Thao tác</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {receiptData && receiptData.map((receipt) => (
                                        <tr key={receipt.receipt_id}>
                                            <td>{receipt.receipt_id}</td>
                                            <td>{receipt.full_name}</td>
                                            <td>{receipt.created_at}</td>
                                            <td className="text-end">{formatCurrency(receipt.total_price)}</td>
                                            <td className="text-center">
                                                <Button
                                                    variant="info"
                                                    size="sm"
                                                    onClick={() => handleViewReceiptDetail(receipt)}
                                                >
                                                    <i className='fa-solid fa-eye'></i>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                    <tfoot>
                                    <tr>
                                        <td colSpan="3" className="text-end fw-bold">Tổng cộng:</td>
                                        <td className="text-end fw-bold">
                                            {receiptData && formatCurrency(receiptData.reduce((sum, item) => sum + item.total_price, 0))}
                                        </td>
                                        <td></td>
                                    </tr>
                                    </tfoot>
                                </Table>
                                {receiptData && receiptData.length === 0 && (
                                    <div className="text-center py-3">
                                        <p>Không có dữ liệu hóa đơn bán</p>
                                    </div>
                                )}
                            </div>
                        </Tab>
                        <Tab
                            title={'Hóa đơn nhập'}
                            eventKey={'hdnhap'}
                            style={{borderRadius: '5px', padding: '15px 0'}}
                        >
                            <div className="p-3">
                                <h4 className="mb-3">Danh sách hóa đơn nhập</h4>
                                <Table striped bordered hover responsive>
                                    <thead className="bg-success text-white">
                                    <tr>
                                        <th>Mã nhập</th>
                                        <th>Nhà cung cấp</th>
                                        <th>Ngày nhập</th>
                                        <th>Tổng tiền</th>
                                        <th>Thao tác</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {importData && importData.map((importItem) => (
                                        <tr key={importItem.import_id}>
                                            <td>{importItem.import_id}</td>
                                            <td>{importItem.provider_name}</td>
                                            <td>{importItem.date}</td>
                                            <td className="text-end">{formatCurrency(importItem.total)}</td>
                                            <td className="text-center">
                                                <Button
                                                    variant="info"
                                                    size="sm"
                                                    onClick={() => handleViewImportDetail(importItem)}
                                                >
                                                    <i className='fa-solid fa-eye'></i>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                    <tfoot>
                                    <tr>
                                        <td colSpan="3" className="text-end fw-bold">Tổng cộng:</td>
                                        <td className="text-end fw-bold">
                                            {importData && formatCurrency(importData.reduce((sum, item) => sum + item.total, 0))}
                                        </td>
                                        <td></td>
                                    </tr>
                                    </tfoot>
                                </Table>
                                {importData && importData.length === 0 && (
                                    <div className="text-center py-3">
                                        <p>Không có dữ liệu hóa đơn nhập</p>
                                    </div>
                                )}
                            </div>
                        </Tab>
                    </Tabs>
                </Modal.Body>
            </Modal>

            <Modal show={showReceiptDetail} onHide={() => setShowReceiptDetail(false)} size="lg">
                <div style={{background: 'linear-gradient(to right, var(--yellow), #ffd454, #ffc454, #ffa454)'}}>
                    <Modal.Header closeButton>
                        <Modal.Title>Chi tiết hóa đơn bán #{selectedReceipt?.receipt_id}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedReceipt && (
                            <div>
                                <div className="mb-3 p-3 border rounded">
                                    <h5 className="border-bottom pb-2 mb-3">Thông tin hóa đơn</h5>
                                    <div className="row">
                                        <div className="col-md-6 mb-2">
                                            <strong>Mã hóa đơn:</strong> #{selectedReceipt.receipt_id}
                                        </div>
                                        <div className="col-md-6 mb-2">
                                            <strong>Khách hàng:</strong> {selectedReceipt.full_name}
                                        </div>
                                        <div className="col-md-6 mb-2">
                                            <strong>Ngày tạo:</strong> {selectedReceipt.created_at}
                                        </div>
                                        <div className="col-md-6 mb-2">
                                            <strong>Tổng tiền:</strong> {formatCurrency(selectedReceipt.total_price)}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-3">
                                    <h5 className="border-bottom pb-2 mb-3">Chi tiết sản phẩm</h5>
                                    <Table striped bordered hover responsive>
                                        <thead className="bg-primary text-white">
                                        <tr>
                                            <th>Mã</th>
                                            <th>Tên</th>
                                            <th>Ảnh</th>
                                            <th>SL</th>
                                            <th>Giá</th>
                                            <th>TT</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {receiptDetails && receiptDetails.map((item) => (
                                            <tr key={item.sku_id}>
                                                <td>{item.sku_id}</td>
                                                <td>{item.sku_name}</td>
                                                <td>
                                                    <img
                                                        src={`${PRODUCT_IMAGE_PATH}${item.image}`}
                                                        alt={item.sku_name}
                                                        style={{width: '50px', height: '50px', objectFit: 'cover'}}
                                                    />
                                                </td>
                                                <td>{item.quantity}</td>
                                                <td>{formatCurrency(item.price)}</td>
                                                <td>{formatCurrency(item.quantity * item.price)}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowReceiptDetail(false)}>
                            Đóng
                        </Button>
                    </Modal.Footer>
                </div>
            </Modal>

            <Modal show={showImportDetail} onHide={() => setShowImportDetail(false)} size="lg">
                <div style={{background: 'linear-gradient(to right, var(--yellow), #ffd454, #ffc454, #ffa454)'}}>
                    <Modal.Header closeButton>
                        <Modal.Title>Chi tiết hóa đơn nhập #{selectedImport?.import_id}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedImport && (
                            <div>
                                <div className="mb-3 p-3 border rounded">
                                    <h5 className="border-bottom pb-2 mb-3">Thông tin hóa đơn nhập</h5>
                                    <div className="row">
                                        <div className="col-md-6 mb-2">
                                            <strong>Mã nhập hàng:</strong> #{selectedImport.import_id}
                                        </div>
                                        <div className="col-md-6 mb-2">
                                            <strong>Nhà cung cấp:</strong> {selectedImport.provider_name}
                                        </div>
                                        <div className="col-md-6 mb-2">
                                            <strong>Ngày nhập:</strong> {selectedImport.date}
                                        </div>
                                        <div className="col-md-6 mb-2">
                                            <strong>Tổng tiền:</strong> {formatCurrency(selectedImport.total)}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-3">
                                    <h5 className="border-bottom pb-2 mb-3">Chi tiết sản phẩm nhập</h5>
                                    <Table striped bordered hover responsive>
                                        <thead className="bg-primary text-white">
                                        <tr>
                                            <th>Mã</th>
                                            <th>Tên</th>
                                            <th>Ảnh</th>
                                            <th>SL</th>
                                            <th>Giá</th>
                                            <th>TT</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {importDetails && importDetails.map((item) => (
                                            <tr key={item.sku_id}>
                                                <td>{item.sku_id}</td>
                                                <td>{item.sku_name}</td>
                                                <td>
                                                    <img
                                                        src={`${PRODUCT_IMAGE_PATH}${item.image}`}
                                                        alt={item.sku_name}
                                                        style={{width: '50px', height: '50px', objectFit: 'cover'}}
                                                    />
                                                </td>
                                                <td>{item.quantity}</td>
                                                <td>{formatCurrency(item.price)}</td>
                                                <td>{formatCurrency(item.quantity * item.price)}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowImportDetail(false)}>
                            Đóng
                        </Button>
                    </Modal.Footer>
                </div>
            </Modal>
        </>
    )
}

export default ModalDetailProductStatistic;