import { Modal, Button } from "react-bootstrap";
import '../../../styles/Admin/Confirm.css'


const ModalConfirmDelete = ({show, handleClose, handleDelete, title, body}) => {

    return (
        <Modal show={show} onHide={handleClose} centered onS>
            <div style={style}>
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
                    <Button variant="danger" onClick={handleDelete}>
                        Xóa
                    </Button>
                </Modal.Footer>
            </div>
        </Modal>
    );
}

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    padding: "20px",
    background: "linear-gradient(to right, var(--yellow), #ffd454, #ffc454, #ffa454)",
    width: "100%",
    maxWidth: "400px",
    color: "black",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
    animation: "fadeIn 0.5s ease forwards"
};

export default ModalConfirmDelete;