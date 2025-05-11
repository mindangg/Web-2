import { useState } from 'react';
import { Modal, Button, Form, Col, Row } from 'react-bootstrap';

const ModalAddProvider = ({ show, handleClose, onSave }) => {
    // State cho giá trị form
    const [formData, setFormData] = useState({
        provider_name: '',
        phone: '',
        address: '',
        email: '',
        status: true
    });

    const [errors, setErrors] = useState({
        provider_name: '',
        phone: '',
        email: '',
        address: ''
    });

    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newValue = value;

        setFormData({
            ...formData,
            [name]: newValue
        });

        if (submitted) {
            validateField(name, newValue);
        }
    };

    const validateField = (fieldName, value) => {
        let fieldError = '';

        switch (fieldName) {
            case 'provider_name':
                if (!value.trim()) {
                    fieldError = 'Tên nhà cung cấp không được để trống';
                } else if (value.length > 30) {
                    fieldError = 'Tên nhà cung cấp không được vượt quá 30 ký tự';
                }
                break;

            case 'phone':
                if (!value.trim()) {
                    fieldError = 'Số điện thoại không được để trống';
                } else if (!/^0\d{9}$/.test(value)) {
                    fieldError = 'Số điện thoại không hợp lệ';
                } else if (value.length > 20) {
                    fieldError = 'Số điện thoại không được vượt quá 20 ký tự';
                }
                break;

            case 'email':
                if (!value.trim()) {
                    fieldError = 'Email không được để trống';
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    fieldError = 'Email không hợp lệ';
                } else if (value.length > 50) {
                    fieldError = 'Email không được vượt quá 50 ký tự';
                }
                break;

            case 'address':
                if (!value.trim()) {
                    fieldError = 'Địa chỉ không được để trống';
                } else if (value.length > 255) {
                    fieldError = 'Địa chỉ không được vượt quá 255 ký tự';
                }
                break;

            default:
                break;
        }

        setErrors(prevErrors => ({
            ...prevErrors,
            [fieldName]: fieldError
        }));

        return !fieldError;
    };

    // Validate tất cả các trường
    const validateForm = () => {
        let isValid = true;

        Object.keys(formData).forEach(field => {
            if (field !== 'status') {
                const fieldIsValid = validateField(field, formData[field]);
                if (!fieldIsValid) {
                    isValid = false;
                }
            }
        });

        return isValid;
    };

    // Xử lý blur (khi người dùng rời khỏi một trường)
    const handleBlur = (e) => {
        const { name, value } = e.target;
        validateField(name, value);
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            provider_name: '',
            phone: '',
            address: '',
            email: '',
            status: true
        });
        setErrors({
            provider_name: '',
            phone: '',
            email: '',
            address: ''
        });
        setSubmitted(false);
    };

    // Xử lý đóng modal
    const handleModalClose = () => {
        resetForm();
        handleClose();
    };

    // Xử lý submit form
    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);

        if (validateForm()) {
            setIsSubmitting(true);

            // Thực hiện gửi dữ liệu
            setTimeout(() => {
                console.log('Submitting provider:', formData);
                onSave(formData);
                setIsSubmitting(false);
                handleModalClose();
            }, 400);
        } else {
            // Focus vào trường đầu tiên có lỗi
            const firstErrorField = document.querySelector('.is-invalid');
            if (firstErrorField) {
                firstErrorField.focus();
            }
        }
    };

    return (
        <Modal show={show} onHide={handleModalClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Thêm Nhà Cung Cấp Mới</Modal.Title>
            </Modal.Header>

            <Form noValidate onSubmit={handleSubmit}>
                <Modal.Body>
                    <Row className="mb-3">
                        <Form.Group as={Col}>
                            <Form.Label>Tên nhà cung cấp <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                name="provider_name"
                                value={formData.provider_name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={!!errors.provider_name}
                                placeholder="Nhập tên nhà cung cấp"
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.provider_name}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} md={6}>
                            <Form.Label>Số điện thoại <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={!!errors.phone}
                                placeholder="Nhập số điện thoại"
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.phone}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as={Col} md={6}>
                            <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={!!errors.email}
                                placeholder="Nhập email"
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.email}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col}>
                            <Form.Label>Địa chỉ <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={!!errors.address}
                                placeholder="Nhập địa chỉ"
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.address}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>
                        Hủy
                    </Button>
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Đang lưu...' : 'Lưu'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default ModalAddProvider;