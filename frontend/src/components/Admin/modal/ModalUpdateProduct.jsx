import { useState, useEffect, useRef } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { PRODUCT_API_URL, PRODUCT_IMAGE_PATH } from "../../../utils/Constant.jsx";
import { useNotificationContext } from "../../../hooks/useNotificationContext.jsx";

export default function ModalUpdateProduct({ show, handleClose, selectedProduct, refreshList, optionList }) {
    const { showNotification } = useNotificationContext();
    const [formData, setFormData] = useState({
        product_id: '',
        name: '',
        brand: '',
        provider: '',
        series: '',
        image: null,
        cpu: '',
        screen: '',
        battery: '',
        front_camera: '',
        back_camera: '',
        description: '',
        base_price: '',
        release_date: '',
        warranty_period: '',
        status: true
    });
    const [previewImage, setPreviewImage] = useState('');
    const [errors, setErrors] = useState({}); // State for validation errors
    const formRefs = useRef({}); // Refs to focus invalid fields

    useEffect(() => {
        if (selectedProduct) {
            setFormData({
                product_id: selectedProduct.product_id || '',
                name: selectedProduct.name || '',
                brand: selectedProduct.brand || '',
                provider: selectedProduct.provider || '',
                series: selectedProduct.series || '',
                image: null,
                cpu: selectedProduct.cpu || '',
                screen: selectedProduct.screen || '',
                battery: selectedProduct.battery || '',
                front_camera: selectedProduct.front_camera || '',
                back_camera: selectedProduct.back_camera || '',
                description: selectedProduct.description || '',
                base_price: selectedProduct.base_price || '',
                release_date: selectedProduct.release_date ? new Date(selectedProduct.release_date).toISOString().split('T')[0] : '',
                warranty_period: selectedProduct.warranty_period || '',
                status: selectedProduct.status !== undefined ? selectedProduct.status : true
            });

            if (selectedProduct.image) {
                const imageUrl = `${PRODUCT_IMAGE_PATH}${selectedProduct.image}`;
                setPreviewImage(imageUrl);

                fetch(imageUrl)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.blob();
                    })
                    .then(blob => {
                        const file = new File([blob], selectedProduct.image, { type: blob.type });
                        setFormData(prev => ({ ...prev, image: file }));
                    })
                    .catch(error => {
                        console.error("Không thể tạo file từ hình ảnh:", error);
                    });
            } else {
                setPreviewImage('');
            }
        }
    }, [selectedProduct]);

    // Validate form fields based on schema
    const validateForm = () => {
        const newErrors = {};

        // Required fields
        if (!formData.brand) newErrors.brand = "Vui lòng chọn thương hiệu.";
        if (!formData.provider) newErrors.provider = "Vui lòng chọn nhà cung cấp.";
        if (!formData.series) newErrors.series = "Vui lòng nhập series.";
        else if (formData.series.length > 50) newErrors.series = "Series không được vượt quá 50 ký tự.";
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

    const handleInputChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        let newValue;

        if (type === 'checkbox') {
            newValue = checked;
        } else if (type === 'file') {
            const file = files[0];
            newValue = file || null;
            if (file) {
                setPreviewImage(URL.createObjectURL(file));
            } else {
                setPreviewImage(previewImage); // Keep existing preview if no new file
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            // Focus on the first invalid field
            const firstErrorField = Object.keys(errors)[0];
            if (firstErrorField && formRefs.current[firstErrorField]) {
                formRefs.current[firstErrorField].focus();
            }
            showNotification('Vui lòng kiểm tra và sửa các lỗi trong biểu mẫu.', 'error');
            return;
        }

        try {
            const form = new FormData();
            form.append('product_id', formData.product_id);
            form.append('name', formData.name);
            form.append('brand', formData.brand);
            form.append('provider', formData.provider);
            form.append('series', formData.series);
            if (formData.image) form.append('image', formData.image); // Only append image if changed
            form.append('cpu', formData.cpu);
            form.append('screen', formData.screen);
            form.append('battery', formData.battery);
            form.append('front_camera', formData.front_camera);
            form.append('back_camera', formData.back_camera);
            form.append('description', formData.description);
            form.append('base_price', formData.base_price);
            form.append('release_date', formData.release_date);
            form.append('warranty_period', formData.warranty_period);
            form.append('status', formData.status.toString());

            const response = await fetch(`${PRODUCT_API_URL}/${formData.product_id}`, {
                method: 'POST',
                body: form,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update product');
            }

            const data = await response.json();

            showNotification(data.message);
            handleClose();
            refreshList();
        } catch (error) {
            console.error('Error updating product:', error);
            showNotification(`Lỗi: ${error.message}`, 'error');
        }
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Cập nhật sản phẩm</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6">
                            <Form.Group className="mb-3" controlId="productId">
                                <Form.Label>Mã sản phẩm</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="product_id"
                                    value={formData.product_id}
                                    disabled
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="productName">
                                <Form.Label>Tên sản phẩm</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    disabled
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="productBrand">
                                <Form.Label>Hãng</Form.Label>
                                <Form.Select
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleInputChange}
                                    required
                                    isInvalid={!!errors.brand}
                                    ref={el => (formRefs.current.brand = el)}
                                >
                                    {optionList.brands.map((brand) => (
                                        <option key={brand.brand_id} value={brand.brand_id}>
                                            {brand.brand_name}
                                        </option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    {errors.brand}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="productProvider">
                                <Form.Label>Nhà cung cấp</Form.Label>
                                <Form.Select
                                    name="provider"
                                    value={formData.provider}
                                    onChange={handleInputChange}
                                    required
                                    isInvalid={!!errors.provider}
                                    ref={el => (formRefs.current.provider = el)}
                                >
                                    {optionList.providers.map((provider) => (
                                        <option key={provider.provider_id} value={provider.provider_id}>
                                            {provider.provider_name}
                                        </option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    {errors.provider}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="productSeries">
                                <Form.Label>Series</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="series"
                                    value={formData.series}
                                    onChange={handleInputChange}
                                    required
                                    isInvalid={!!errors.series}
                                    ref={el => (formRefs.current.series = el)}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.series}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="productCPU">
                                <Form.Label>CPU</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="cpu"
                                    value={formData.cpu}
                                    onChange={handleInputChange}
                                    isInvalid={!!errors.cpu}
                                    ref={el => (formRefs.current.cpu = el)}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.cpu}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="productScreen">
                                <Form.Label>Màn hình</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="screen"
                                    value={formData.screen}
                                    onChange={handleInputChange}
                                    isInvalid={!!errors.screen}
                                    ref={el => (formRefs.current.screen = el)}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.screen}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </div>

                        <div className="col-md-6">
                            <Form.Group className="mb-3" controlId="productBattery">
                                <Form.Label>Pin</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="battery"
                                    value={formData.battery}
                                    onChange={handleInputChange}
                                    isInvalid={!!errors.battery}
                                    ref={el => (formRefs.current.battery = el)}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.battery}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="productFrontCamera">
                                <Form.Label>Camera trước</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="front_camera"
                                    value={formData.front_camera}
                                    onChange={handleInputChange}
                                    isInvalid={!!errors.front_camera}
                                    ref={el => (formRefs.current.front_camera = el)}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.front_camera}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="productBackCamera">
                                <Form.Label>Camera sau</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="back_camera"
                                    value={formData.back_camera}
                                    onChange={handleInputChange}
                                    isInvalid={!!errors.back_camera}
                                    ref={el => (formRefs.current.back_camera = el)}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.back_camera}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="productPrice">
                                <Form.Label>Giá cơ bản</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="base_price"
                                    value={`${formData.base_price.toLocaleString('vi-VN')}đ`}
                                    disabled
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="productReleaseDate">
                                <Form.Label>Ngày ra mắt</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="release_date"
                                    value={formData.release_date}
                                    onChange={handleInputChange}
                                    required
                                    isInvalid={!!errors.release_date}
                                    ref={el => (formRefs.current.release_date = el)}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.release_date}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="productWarranty">
                                <Form.Label>Thời gian bảo hành (tháng)</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="warranty_period"
                                    value={formData.warranty_period}
                                    onChange={handleInputChange}
                                    required
                                    isInvalid={!!errors.warranty_period}
                                    ref={el => (formRefs.current.warranty_period = el)}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.warranty_period}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mt-5" controlId="productStatus">
                                <Form.Check
                                    type="switch"
                                    label={formData.status ? 'Kinh doanh' : 'Ngừng kinh doanh'}
                                    name="status"
                                    checked={formData.status}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                        </div>
                    </div>

                    <Form.Group className="mb-3" controlId="productDescription">
                        <Form.Label>Mô tả</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            ref={el => (formRefs.current.description = el)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="productImage">
                        <Form.Label>Hình ảnh sản phẩm</Form.Label>
                        <Form.Control
                            type="file"
                            name="image"
                            onChange={handleInputChange}
                            accept="image/*"
                            ref={el => (formRefs.current.image = el)}
                        />
                        {previewImage && (
                            <div className="mt-2 text-center">
                                <img
                                    src={previewImage}
                                    alt="Preview"
                                    style={{ maxWidth: "100%", maxHeight: "250px", borderRadius: "8px" }}
                                />
                            </div>
                        )}
                    </Form.Group>

                    <div className="d-flex justify-content-end gap-2">
                        <Button variant="secondary" onClick={handleClose}>
                            Hủy
                        </Button>
                        <Button variant="primary" type="submit">
                            Cập nhật
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}