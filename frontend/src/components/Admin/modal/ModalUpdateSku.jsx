import { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Image } from 'react-bootstrap';
import {API_URL, PRODUCT_IMAGE_PATH} from "../../../utils/Constant.jsx";
import { useNotificationContext } from "../../../hooks/useNotificationContext.jsx";

const ModalUpdateSku = ({ show, handleClose, skuData, onSkuUpdated }) => {
    const [formData, setFormData] = useState({
        sku_id: '',
        product_id: '',
        internal_id: '',
        color_id: '',
        sku_code: '',
        sku_name: '',
        image: null,
        import_price: '',
        invoice_price: '',
        stock: '',
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [internalOptions, setInternalOptions] = useState([]);
    const [colorOptions, setColorOptions] = useState([]);
    const [validated, setValidated] = useState(false);
    const { showNotification } = useNotificationContext();

    // State for color modal
    const [showAddColor, setShowAddColor] = useState(false);
    const [colorFormData, setColorFormData] = useState({
        color: ''
    });

    // Initialize form data when skuData changes
    useEffect(() => {
        if (skuData && show) {
            setFormData({
                sku_id: skuData.sku_id || '',
                product_id: skuData.product_id || '',
                internal_id: skuData.internal_id || '',
                color_id: skuData.color_id || '',
                sku_code: skuData.sku_code || '',
                sku_name: skuData.sku_name || '',
                import_price: skuData.import_price || '',
                invoice_price: skuData.invoice_price || '',
                stock: skuData.stock || 0,
                image: null,
            });

            // Set image preview from existing image URL
            if (skuData.image) {
                const imageUrl = `${PRODUCT_IMAGE_PATH}${skuData.image}`;
                setImagePreview(imageUrl);

                fetch(imageUrl)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.blob();
                    })
                    .then(blob => {
                        const file = new File([blob], skuData.image, { type: blob.type });
                        setFormData(prev => ({ ...prev, image: file }));
                    })
                    .catch(error => {
                        console.error("Không thể tạo file từ hình ảnh:", error);
                    });
            } else {
                setImagePreview('');
            }

        }
    }, [skuData, show]);

    // Fetch internal options and color options
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

    // Helper function to refresh data after adding a new color
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

    const handleCloseModal = () => {
        setValidated(false);
        handleClose();
    };

    // Handle color submission
    const handleSubmitColor = async (e) => {
        e.preventDefault();
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
            setColorFormData({ color: '' });
            setShowAddColor(false);

            // Refresh danh sách màu sắc
            await refreshData();
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

            // Append all form data fields
            Object.keys(formData).forEach(key => {
                submitData.append(key, formData[key]);
            });

            const response = await fetch(`${API_URL}sku/${formData.sku_id}`, {
                method: 'POST',
                body: submitData
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();

            showNotification(result.message);

            handleCloseModal();
            if (onSkuUpdated) {
                onSkuUpdated();
            }

        } catch (error) {
            console.error('Error updating SKU:', error);
            showNotification('Có lỗi xảy ra khi cập nhật SKU');
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
                        <Modal.Title>Cập nhật thông tin SKU</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group controlId="skuCode">
                                    <Form.Label>Mã SKU</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="sku_code"
                                        value={formData.sku_code}
                                        onChange={handleChange}
                                        disabled
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="skuName">
                                    <Form.Label>Tên SKU</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="sku_name"
                                        value={formData.sku_name}
                                        onChange={handleChange}
                                        disabled
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col>
                                <Form.Group controlId="skuImage">
                                    <Form.Label>Hình ảnh {!imagePreview && <span className="text-danger">*</span>}</Form.Label>
                                    <Form.Control
                                        type="file"
                                        name="image"
                                        onChange={handleImageChange}
                                        accept="image/*"
                                        required={!imagePreview}
                                    />
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
                            <Col md={4}>
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
                            <Col md={4}>
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
                            <Col md={4}>
                                <Form.Group controlId="stock">
                                    <Form.Label>Số lượng tồn <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        min="0"
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Vui lòng nhập số lượng tồn hợp lệ
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
                            Cập nhật
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Modal thêm màu sắc */}
            <Modal
                show={showAddColor}
                onHide={() => setShowAddColor(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Thêm màu sắc mới</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmitColor}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Tên màu <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                name="color"
                                value={colorFormData.color}
                                onChange={handleColorChange}
                                placeholder="Nhập tên màu (VD: Black, White, Red,...)"
                                required
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

export default ModalUpdateSku;