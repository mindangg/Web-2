import { Modal, Button } from "react-bootstrap";
import {PRODUCT_API_URL} from "../../../utils/Constant.jsx";
import {useNotificationContext} from "../../../hooks/useNotificationContext.jsx";


const ModalConfirmDelete = ({show, handleClose, refreshList, productId, title, body}) => {
    const { showNotification } = useNotificationContext();

    const handleDeleteProduct = async () => {
        try {
            const response = await fetch(`${PRODUCT_API_URL}/${productId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                throw new Error('Xóa sản phẩm thất bại');
            }

            const data = await response.json();

            showNotification(data.message, "success");
            handleClose();
            refreshList();
        } catch (error) {
            console.error(error);
            showNotification("Xóa sản phẩm thất bại", "danger");
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {body}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Hủy
                </Button>
                <Button variant="danger" onClick={handleDeleteProduct}>
                    Xóa
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalConfirmDelete;