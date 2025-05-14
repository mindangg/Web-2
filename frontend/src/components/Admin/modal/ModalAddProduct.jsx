import { useState, useRef } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { useNotificationContext } from "../../../hooks/useNotificationContext.jsx";
import { API_URL, PRODUCT_API_URL } from "../../../utils/Constant.jsx";
import ModalAddProvider from "./ModalAddProvider.jsx";

export default function ModalAddProduct({ show, handleClose, refreshList, optionList }) {
    const { showNotification } = useNotificationContext();
    const [imagePreview, setImagePreview] = useState(null);
    const [showAddBrand, setShowAddBrand] = useState(false);
    const [showAddProvider, setShowAddProvider] = useState(false);
    const [errors, setErrors] = useState({}); // State for validation errors
    const formRefs = useRef({}); // Refs to focus invalid fields

    // State for brand form
    const [brandFormData, setBrandFormData] = useState({
        brand_name: ""
    });

    // State for provider form
    const [providerFormData, setProviderFormData] = useState({
        provider_name: "",
        phone: "",
        address: "",
        email: ""
    });

    // State for product form
    const [formData, setFormData] = useState({
        brand: "",
        provider: "",
        series: "",
        name: "",
        image: null,
        cpu: "",
        screen: "",
        battery: "",
        front_camera: "",
        back_camera: "",
        description: "",
        release_date: "",
        warranty_period: "",
    });

    const [validationErrors, setValidationErrors] = useState({
        provider_name: false,
        phone: false,
        address: false,
        email: false
    });
    const [brandError, setBrandError] = useState(false);

    const providerNameRef = useRef(null);
    const phoneRef = useRef(null);
    const addressRef = useRef(null);
    const emailRef = useRef(null);
    const brandInputRef = useRef(null);

    // Validate form fields based on schema
    const validateForm = () => {
        const newErrors = {};

        // Required fields
        if (!formData.brand) newErrors.brand = "Vui lòng chọn thương hiệu.";
        if (!formData.provider) newErrors.provider = "Vui lòng chọn nhà cung cấp.";
        if (!formData.series) newErrors.series = "Vui lòng nhập series.";
        else if (formData.series.length > 50) newErrors.series = "Series không được vượt quá 50 ký tự.";
        if (!formData.name) newErrors.name = "Vui lòng nhập tên sản phẩm.";
        else if (formData.name.length > 50) newErrors.name = "Tên sản phẩm không được vượt quá 50 ký tự.";
        if (!formData.image) newErrors.image = "Vui lòng chọn hình ảnh.";
        if (!formData.release_date) newErrors.release_date = "Vui lòng chọn ngày ra mắt.";
        else if (isNaN(new Date(formData.release_date).getTime())) newErrors.release_date = "Ngày ra mắt không hợp lệ.";
        if (formData.warranty_period === "") newErrors.warranty_period = "Vui lòng nhập thời gian bảo hành.";
        else if (!/^\d+$/.test(formData.warranty_period) || parseInt(formData.warranty_period) < 0 || parseInt(formData.warranty_period) > 255)
            newErrors.warranty_period = "Thời gian bảo hành phải là số từ 0 đến 255.";

        // Optional fields with length constraints
        if (formData.cpu && formData.cpu.length > 50) newErrors.cpu = "CPU không được vượt quá 50 ký tự.";
        if (formData.screen && formData.screen.length > 50) newErrors.screen = "Màn hình không được vượt quá 50 ký tự.";
        if (formData.battery && formData.battery.length > 50) newErrors.battery = "Pin không được vượt quá 50 ký tự.";
        if (formData.front_camera && formData.front_camera.length > 100) newErrors.front_camera = "Camera trước không được vượt quá 100 ký tự.";
        if (formData.back_camera && formData.back_camera.length > 100) newErrors.back_camera = "Camera sau không được vượt quá 100 ký tự.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        let newValue;

        if (type === 'checkbox') {
            newValue = checked;
        } else if (type === 'file') {
            const file = files[0];
            newValue = file || null;
            if (file) {
                setImagePreview(URL.createObjectURL(file));
            } else {
                setImagePreview(null);
            }
        } else {
            newValue = value;
        }

        setFormData(prev => ({ ...prev, [name]: newValue }));

        // Real-time validation
        const newErrors = { ...errors };
        delete newErrors[name]; // Clear error for this field
        setErrors(newErrors);

        // Re-validate the field
        const tempErrors = {};
        if (name === "brand" && !newValue) tempErrors.brand = "Vui lòng chọn thương hiệu.";
        if (name === "provider" && !newValue) tempErrors.provider = "Vui lòng chọn nhà cung cấp.";
        if (name === "series") {
            if (!newValue) tempErrors.series = "Vui lòng nhập series.";
            else if (newValue.length > 50) tempErrors.series = "Series không được vượt quá 50 ký tự.";
        }
        if (name === "name") {
            if (!newValue) tempErrors.name = "Vui lòng nhập tên sản phẩm.";
            else if (newValue.length > 50) tempErrors.name = "Tên sản phẩm không được vượt quá 50 ký tự.";
        }
        if (name === "image" && !newValue) tempErrors.image = "Vui lòng chọn hình ảnh.";
        if (name === "release_date") {
            if (!newValue) tempErrors.release_date = "Vui lòng chọn ngày ra mắt.";
            else if (isNaN(new Date(newValue).getTime())) tempErrors.release_date = "Ngày ra mắt không hợp lệ.";
        }
        if (name === "warranty_period") {
            if (newValue === "") tempErrors.warranty_period = "Vui lòng nhập thời gian bảo hành.";
            else if (!/^\d+$/.test(newValue) || parseInt(newValue) < 0 || parseInt(newValue) > 255)
                tempErrors.warranty_period = "Thời gian bảo hành phải là số từ 0 đến 255.";
        }
        if (name === "cpu" && newValue && newValue.length > 50) tempErrors.cpu = "CPU không được vượt quá 50 ký tự.";
        if (name === "screen" && newValue && newValue.length > 50) tempErrors.screen = "Màn hình không được vượt quá 50 ký tự.";
        if (name === "battery" && newValue && newValue.length > 50) tempErrors.battery = "Pin không được vượt quá 50 ký tự.";
        if (name === "front_camera" && newValue && newValue.length > 100) tempErrors.front_camera = "Camera trước không được vượt quá 100 ký tự.";
        if (name === "back_camera" && newValue && newValue.length > 100) tempErrors.back_camera = "Camera sau không được vượt quá 100 ký tự.";

        setErrors(prev => ({ ...prev, ...tempErrors }));
    };

    const handleBrandChange = (e) => {
        const { name, value } = e.target;
        setBrandFormData(prev => ({ ...prev, [name]: value }));
        if (brandError) {
            setBrandError(false);
        }
    };

    const handleProviderChange = (e) => {
        const { name, value } = e.target;
        setProviderFormData(prev => ({ ...prev, [name]: value }));

        if (validationErrors[name]) {
            setValidationErrors(prev => ({ ...prev, [name]: false }));
        }
    };

    const validateBrandForm = () => {
        if (!brandFormData.brand_name.trim()) {
            setBrandError(true);
            // Focus vào trường input
            brandInputRef.current?.focus();
            return false;
        }
        return true;
    };

    const validateProviderForm = () => {
        const errors = {
            provider_name: !providerFormData.provider_name.trim(),
            phone: !providerFormData.phone.trim() || !/^0\d{9}$/.test(providerFormData.phone),
            address: !providerFormData.address.trim(),
            email: !providerFormData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(providerFormData.email),
        };

        setValidationErrors(errors);

        if (errors.provider_name) {
            providerNameRef.current?.focus();
            return false;
        }

        if (errors.phone) {
            phoneRef.current?.focus();
            return false;
        }

        if (errors.address) {
            addressRef.current?.focus();
            return false;
        }

        if (errors.email) {
            emailRef.current?.focus();
            return false;
        }

        return !Object.values(errors).some(Boolean);
    };

    const handleSubmitBrand = async (e) => {
        e.preventDefault();

        if (!validateBrandForm()) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}brand`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(brandFormData),
            });

            if (!response.ok) throw new Error('Thêm thương hiệu thất bại');

            const data = await response.json();
            showNotification(data.message);
            if (data.status === 400) {
                setShowAddBrand(false);
                refreshList();
            }
            setBrandFormData({ brand_name: "" });
        } catch (error) {
            console.error(error);
            showNotification('Có lỗi xảy ra khi thêm thương hiệu', 'error');
        }
    };

    const handleSubmitProvider = async (e) => {
        e.preventDefault();

        if (!validateProviderForm()) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}provider`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(providerFormData),
            });

            const data = await response.json();
            showNotification(data.message);
            if (data.status !== 400) {
                setShowAddProvider(false);
                refreshList();
            }
            setProviderFormData({ provider_name: "", phone: "", address: "", email: "" });
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            const firstErrorField = Object.keys(errors)[0];
            if (firstErrorField && formRefs.current[firstErrorField]) {
                formRefs.current[firstErrorField].focus();
            }
            showNotification('Vui lòng kiểm tra và sửa các lỗi trong biểu mẫu.', 'error');
            return;
        }

        const form = new FormData();
        for (let key in formData) {
            if (formData[key] !== null && formData[key] !== "") {
                form.append(key, formData[key]);
            }
        }

        try {
            const response = await fetch(`${PRODUCT_API_URL}`, {
                method: 'POST',
                body: form,
            });

            if (!response.ok) throw new Error('Thêm sản phẩm thất bại');

            const data = await response.json();
            showNotification(data.message);
            handleClose();
            refreshList();
        } catch (error) {
            console.error(error);
            showNotification('Có lỗi xảy ra khi thêm sản phẩm', 'error');
        }
    };

    return (
        <>
            <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Thêm sản phẩm mới</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit} encType="multipart/form-data">
                    <Modal.Body>
                        <Row className="g-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Tên sản phẩm<span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        
                                        isInvalid={!!errors.name}
                                        ref={el => (formRefs.current.name = el)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.name}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Series<span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        name="series"
                                        value={formData.series}
                                        onChange={handleChange}
                                        
                                        isInvalid={!!errors.series}
                                        ref={el => (formRefs.current.series = el)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.series}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Thương hiệu<span className="text-danger">*</span></Form.Label>
                                    <div className={'d-flex gap-2'}>
                                        <Form.Select
                                            name="brand"
                                            value={formData.brand}
                                            onChange={handleChange}
                                            
                                            isInvalid={!!errors.brand}
                                            ref={el => (formRefs.current.brand = el)}
                                        >
                                            <option value="">Chọn thương hiệu</option>
                                            {optionList?.brands && optionList.brands.map((brand) => (
                                                <option key={brand.brand_id} value={brand.brand_id}>
                                                    {brand.brand_name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                        <Button
                                            variant={'outline-success'}
                                            style={{ height: '40px' }}
                                            onClick={() => setShowAddBrand(true)}
                                        >
                                            <i className="fa-solid fa-plus"></i>
                                        </Button>
                                    </div>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.brand}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Nhà cung cấp<span className="text-danger">*</span></Form.Label>
                                    <div className={'d-flex gap-2'}>
                                        <Form.Select
                                            name="provider"
                                            value={formData.provider}
                                            onChange={handleChange}
                                            
                                            isInvalid={!!errors.provider}
                                            ref={el => (formRefs.current.provider = el)}
                                        >
                                            <option value="">Chọn nhà cung cấp</option>
                                            {optionList?.providers && optionList.providers.map((provider) => (
                                                <option key={provider.provider_id} value={provider.provider_id}>
                                                    {provider.provider_name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                        <Button
                                            variant={'outline-success'}
                                            style={{ height: '40px' }}
                                            onClick={() => setShowAddProvider(true)}
                                        >
                                            <i className="fa-solid fa-plus"></i>
                                        </Button>
                                    </div>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.provider}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>CPU</Form.Label>
                                    <Form.Control
                                        name="cpu"
                                        value={formData.cpu}
                                        onChange={handleChange}
                                        isInvalid={!!errors.cpu}
                                        ref={el => (formRefs.current.cpu = el)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.cpu}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Màn hình</Form.Label>
                                    <Form.Control
                                        name="screen"
                                        value={formData.screen}
                                        onChange={handleChange}
                                        isInvalid={!!errors.screen}
                                        ref={el => (formRefs.current.screen = el)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.screen}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Pin</Form.Label>
                                    <Form.Control
                                        name="battery"
                                        value={formData.battery}
                                        onChange={handleChange}
                                        isInvalid={!!errors.battery}
                                        ref={el => (formRefs.current.battery = el)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.battery}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Camera trước</Form.Label>
                                    <Form.Control
                                        name="front_camera"
                                        value={formData.front_camera}
                                        onChange={handleChange}
                                        isInvalid={!!errors.front_camera}
                                        ref={el => (formRefs.current.front_camera = el)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.front_camera}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Camera sau</Form.Label>
                                    <Form.Control
                                        name="back_camera"
                                        value={formData.back_camera}
                                        onChange={handleChange}
                                        isInvalid={!!errors.back_camera}
                                        ref={el => (formRefs.current.back_camera = el)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.back_camera}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                            <Col md={6} className={'mt-0'}>
                                <Form.Group>
                                    <Form.Label>Ngày ra mắt<span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="release_date"
                                        value={formData.release_date}
                                        onChange={handleChange}
                                        
                                        isInvalid={!!errors.release_date}
                                        ref={el => (formRefs.current.release_date = el)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.release_date}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Thời gian bảo hành (tháng)<span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="warranty_period"
                                        value={formData.warranty_period}
                                        onChange={handleChange}
                                        
                                        isInvalid={!!errors.warranty_period}
                                        ref={el => (formRefs.current.warranty_period = el)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.warranty_period}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label>Mô tả</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        ref={el => (formRefs.current.description = el)}
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label>Hình ảnh<span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="file"
                                        name="image"
                                        accept="image/*"
                                        onChange={handleChange}
                                        
                                        isInvalid={!!errors.image}
                                        ref={el => (formRefs.current.image = el)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.image}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                {imagePreview && (
                                    <div className="mt-2 text-center">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            style={{ maxWidth: "100%", maxHeight: "250px", borderRadius: "8px" }}
                                        />
                                    </div>
                                )}
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>Hủy</Button>
                        <Button variant="primary" type="submit">Thêm sản phẩm</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Modal thêm thương hiệu */}
            <Modal show={showAddBrand} onHide={() => setShowAddBrand(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Thêm thương hiệu mới</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmitBrand}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Tên thương hiệu</Form.Label>
                            <Form.Control
                                type="text"
                                name="brand_name"
                                value={brandFormData.brand_name}
                                onChange={handleBrandChange}
                                placeholder="Nhập tên thương hiệu"
                                isInvalid={brandError}
                                ref={brandInputRef}
                                style={brandError ? { borderColor: 'red' } : {}}
                            />
                            {brandError && (
                                <Form.Control.Feedback type="invalid">
                                    Vui lòng nhập tên thương hiệu
                                </Form.Control.Feedback>
                            )}
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowAddBrand(false)}>
                            Hủy
                        </Button>
                        <Button variant="primary" type="submit">
                            Thêm thương hiệu
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            <Modal show={showAddProvider} onHide={() => setShowAddProvider(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Thêm nhà cung cấp mới</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmitProvider}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Tên nhà cung cấp</Form.Label>
                            <Form.Control
                                type="text"
                                name="provider_name"
                                value={providerFormData.provider_name}
                                onChange={handleProviderChange}
                                placeholder="Nhập tên nhà cung cấp"
                                isInvalid={validationErrors.provider_name}
                                ref={providerNameRef}
                            />
                            {validationErrors.provider_name && (
                                <Form.Control.Feedback type="invalid">
                                    Vui lòng nhập tên nhà cung cấp
                                </Form.Control.Feedback>
                            )}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Số điện thoại</Form.Label>
                            <Form.Control
                                type="number"
                                name="phone"
                                value={providerFormData.phone}
                                onChange={handleProviderChange}
                                placeholder="Nhập số điện thoại"
                                isInvalid={validationErrors.phone}
                                ref={phoneRef}
                            />
                            {validationErrors.phone && (
                                <Form.Control.Feedback type="invalid">
                                    Số điện thoại không hợp lệ
                                </Form.Control.Feedback>
                            )}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Địa chỉ</Form.Label>
                            <Form.Control
                                type="text"
                                name="address"
                                value={providerFormData.address}
                                onChange={handleProviderChange}
                                placeholder="Nhập địa chỉ"
                                isInvalid={validationErrors.address}
                                ref={addressRef}
                            />
                            {validationErrors.address && (
                                <Form.Control.Feedback type="invalid">
                                    Vui lòng nhập địa chỉ
                                </Form.Control.Feedback>
                            )}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="text"
                                name="email"
                                value={providerFormData.email}
                                onChange={handleProviderChange}
                                placeholder="Nhập email"
                                isInvalid={validationErrors.email}
                                ref={emailRef}
                            />
                            {validationErrors.email && (
                                <Form.Control.Feedback type="invalid">
                                    Email không hợp lệ
                                </Form.Control.Feedback>
                            )}
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowAddProvider(false)}>
                            Hủy
                        </Button>
                        <Button variant="primary" type="submit">
                            Thêm nhà cung cấp
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
}