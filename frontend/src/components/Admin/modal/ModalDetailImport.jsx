import { useEffect, useState } from "react";
import { Modal, Table, Button } from "react-bootstrap";
import {API_URL, PRODUCT_IMAGE_PATH} from "../../../utils/Constant.jsx";
import { useNotificationContext } from "../../../hooks/useNotificationContext.jsx";

const ModalImportDetail = ({ show, handleClose, importId }) => {
    const [details, setDetails] = useState([]);
    const { showNotification } = useNotificationContext();

    useEffect(() => {
        if (!show || !importId) return;

        const controller = new AbortController();
        const signal = controller.signal;

        const fetchImportDetails = async () => {
            try {
                const response = await fetch(`${API_URL}import/${importId}}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    signal: signal,
                });
                const data = await response.json();
                if (data.status === 200) {
                    setDetails(data.import_details);
                } else {
                    showNotification(data.message);
                }
            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error("Error fetching import details:", error);
                    showNotification("Có lỗi xảy ra khi tải chi tiết đơn nhập hàng.");
                }
            }
        };

        fetchImportDetails();

        return () => {
            controller.abort();
        };
    }, [show, importId, showNotification]);

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Chi tiết đơn nhập hàng #{importId}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {details.length > 0 ? (
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên sản phẩm</th>
                            <th>Hình ảnh</th>
                            <th>Số lượng</th>
                            <th>Giá nhập</th>
                            <th>Tổng tiền</th>
                        </tr>
                        </thead>
                        <tbody>
                        {details.map((detail) => (
                            <tr key={detail.import_detail_id}>
                                <td>{detail.import_detail_id}</td>
                                <td>{detail.sku_name}</td>
                                <td>
                                    <img
                                        src={`${PRODUCT_IMAGE_PATH}${detail.image}`}
                                        alt={detail.sku_name}
                                        style={{ width: "50px", height: "50px" }}
                                    />
                                </td>
                                <td>{detail.quantity}</td>
                                <td>{detail.price.toLocaleString()} VND</td>
                                <td>{(detail.quantity * detail.price).toLocaleString()} VND</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                ) : (
                    <p>Không có chi tiết cho đơn nhập hàng này.</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Đóng
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalImportDetail;