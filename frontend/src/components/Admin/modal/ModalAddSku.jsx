import {useState, useEffect, useRef} from 'react';
import { Modal, Button, Form, Row, Col, Image } from 'react-bootstrap';
import { API_URL } from "../../../utils/Constant.jsx";
import {useNotificationContext} from "../../../hooks/useNotificationContext.jsx";

const ModalAddSku = ({ show, handleClose, productId, onSkuAdded }) => {
    const [formData, setFormData] = useState({
        product_id: productId,
        internal_id: '',
        color_id: '',
        image: null,
        import_price: '',
        invoice_price: '',
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [internalOptions, setInternalOptions] = useState([]);
    const [colorOptions, setColorOptions] = useState([]);
    const [validated, setValidated] = useState(false);
    const { showNotification } = useNotificationContext();

    // State cho modal thêm màu sắc
    const [showAddColor, setShowAddColor] = useState(false);
    const [colorFormData, setColorFormData] = useState({
        color: ''
    });

    const [colorError, setColorError] = useState(false);

    const colorInputRef = useRef(null);

    useEffect(() => {
        const fetchInternalOptions = async () => {
            try {
                const response = await fetch(`${API_URL}internal_option`);
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setInternalOptions(data);
            } catch (error) {
                console.error('Error fetching internal options:', error);
            }
        };

        const fetchColorOptions = async () => {
            try {
                const response = await fetch(`${API_URL}color`);
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setColorOptions(data);
            } catch (error) {
                console.error('Error fetching color options:', error);
            }
        };

        if (show) {
            fetchInternalOptions();
            fetchColorOptions();
        }
    }, [show]);

    // Hàm hỗ trợ refresh dữ liệu khi thêm mới thành công
    const refreshData = async () => {
        try {
            const colorResponse = await fetch(`${API_URL}color`);
            if (colorResponse.ok) {
                const data = await colorResponse.json();
                setColorOptions(data);
            }
        } catch (error) {
            console.error('Error refreshing data:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;

        // Handle number inputs
        if (type === 'number') {
            setFormData({
                ...formData,
                [name]: value === '' ? '' : parseInt(value, 10)
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleColorChange = (e) => {
        const { name, value } = e.target;
        setColorFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Reset lỗi khi người dùng thay đổi giá trị
        if (colorError) {
            setColorError(false);
        }
    };

    const validateColorForm = () => {
        if (!colorFormData.color.trim()) {
            setColorError(true);
            colorInputRef.current?.focus();
            return false;
        }
        return true;
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                image: file
            });

            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    const resetForm = () => {
        setFormData({
            product_id: productId,
            internal_id: '',
            color_id: '',
            image: null,
            import_price: '',
            invoice_price: '',
        });
        setImagePreview(null);
        setValidated(false);
    };

    const handleCloseModal = () => {
        resetForm();
        handleClose();
    };

    const handleSubmitColor = async (e) => {
        e.preventDefault();

        if (!validateColorForm()) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}color`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(colorFormData),
            });

            if (!response.ok) throw new Error('Thêm màu sắc thất bại');

            const data = await response.json();
            showNotification(data.message);

            if (data.status === 400) {
                await refreshData();
                setShowAddColor(false);
            }
            setColorFormData({ color: '' });
        } catch (error) {
            console.error(error);
            showNotification('Có lỗi xảy ra khi thêm màu sắc', 'error');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;

        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
            return;
        }

        try {
            const submitData = new FormData();

            Object.keys(formData).forEach(key => {
                if (formData[key] !== null) {
                    submitData.append(key, formData[key]);
                }
            });

            const response = await fetch(`${API_URL}sku`, {
                method: 'POST',
                body: submitData
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();

            showNotification(result.message);

            handleCloseModal();
            if (onSkuAdded) {
                onSkuAdded();
            }

        } catch (error) {
            console.error('Error adding SKU:', error);
        }
    };

    return (
        <>
            <Modal
                show={show}
                onHide={handleCloseModal}
                size="lg"
                centered
                backdrop="static"
                keyboard={false}
            >
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>Thêm phiên bản mới</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row className="mb-3">
                            <Col>
                                <Form.Group controlId="skuImage">
                                    <Form.Label>Hình ảnh <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="file"
                                        name="image"
                                        onChange={handleImageChange}
                                        accept="image/*"
                                        required={!formData.image}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Vui lòng chọn hình ảnh
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        {imagePreview && (
                            <Row className="mb-3">
                                <Col className="text-center">
                                    <Image
                                        src={imagePreview}
                                        alt="Preview"
                                        style={{ maxWidth: "100%", maxHeight: "250px", borderRadius: "8px" }}
                                        className="img-thumbnail"
                                    />
                                </Col>
                            </Row>
                        )}

                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group controlId="internalOption">
                                    <Form.Label>Cấu hình (RAM/Storage) <span className="text-danger">*</span></Form.Label>
                                        <Form.Select
                                            name="internal_id"
                                            value={formData.internal_id}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">--Chọn cấu hình--</option>
                                            {internalOptions.map(option => (
                                                <option key={option.internal_option_id} value={option.internal_option_id}>
                                                    {option.ram}/{option.storage}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        Vui lòng chọn cấu hình
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="colorOption">
                                    <Form.Label>Màu sắc <span className="text-danger">*</span></Form.Label>
                                    <div className={'d-flex gap-2'}>
                                        <Form.Select
                                            name="color_id"
                                            value={formData.color_id}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">--Chọn màu sắc--</option>
                                            {colorOptions.map(color => (
                                                <option key={color.color_id} value={color.color_id}>
                                                    {color.color}
                                                </option>
                                            ))}
                                        </Form.Select>
                                        <Button
                                            variant={'outline-success'}
                                            style={{height: '40px'}}
                                            onClick={() => setShowAddColor(true)}
                                        >
                                            <i className="fa-solid fa-plus"></i>
                                        </Button>
                                    </div>
                                    <Form.Control.Feedback type="invalid">
                                        Vui lòng chọn màu sắc
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group controlId="importPrice">
                                    <Form.Label>Giá nhập (VNĐ) <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="import_price"
                                        value={formData.import_price}
                                        onChange={handleChange}
                                        min="0"
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Vui lòng nhập giá nhập hợp lệ
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="invoicePrice">
                                    <Form.Label>Giá bán (VNĐ) <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="invoice_price"
                                        value={formData.invoice_price}
                                        onChange={handleChange}
                                        min="0"
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Vui lòng nhập giá bán hợp lệ
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Hủy
                        </Button>
                        <Button variant="primary" type="submit">
                            Lưu
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            <Modal
                show={showAddColor}
                onHide={() => setShowAddColor(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Thêm màu sắc mới</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmitColor} noValidate>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Tên màu <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                name="color"
                                value={colorFormData.color}
                                onChange={handleColorChange}
                                placeholder="Nhập tên màu (VD: Đen, Trắng, Đỏ,...)"
                                isInvalid={colorError}
                                ref={colorInputRef}
                            />
                            <Form.Control.Feedback type="invalid">
                                Vui lòng nhập tên màu sắc
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowAddColor(false)}>
                            Hủy
                        </Button>
                        <Button variant="primary" type="submit">
                            Thêm màu sắc
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
};

export default ModalAddSku;