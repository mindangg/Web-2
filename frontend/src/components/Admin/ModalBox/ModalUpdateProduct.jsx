import { useState, useEffect } from 'react';
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

    const handleInputChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else if (type === 'file') {
            const file = files[0];
            if (file) {
                setFormData(prev => ({ ...prev, image: file }));
                setPreviewImage(URL.createObjectURL(file));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const form = new FormData();
            form.append('product_id', formData.product_id);
            form.append('name', formData.name);
            form.append('brand', formData.brand);
            form.append('provider', formData.provider);
            form.append('series', formData.series);
            form.append('image', formData.image);
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

            showNotification('Cập nhật sản phẩm thành công');
            handleClose();
            refreshList();
        } catch (error) {
            console.error('Error updating product:', error);
            showNotification(`Lỗi: ${error.message}`);
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
                                    name="id"
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
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="productBrand">
                                <Form.Label>Hãng</Form.Label>
                                <Form.Select
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleInputChange}
                                    required
                                >
                                    {optionList.brands.map((brand) => (
                                        <option key={brand.brand_id} value={brand.brand_id}>
                                            {brand.brand_name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="productProvider">
                                <Form.Label>Nhà cung cấp</Form.Label>
                                <Form.Select
                                    name="provider"
                                    value={formData.provider}
                                    onChange={handleInputChange}
                                    required
                                >
                                    {optionList.providers.map((provider) => (
                                        <option key={provider.provider_id} value={provider.provider_id}>
                                            {provider.provider_name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="productSeries">
                                <Form.Label>Series</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="series"
                                    value={formData.series}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="productCPU">
                                <Form.Label>CPU</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="cpu"
                                    value={formData.cpu}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="productScreen">
                                <Form.Label>Màn hình</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="screen"
                                    value={formData.screen}
                                    onChange={handleInputChange}
                                />
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
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="productFrontCamera">
                                <Form.Label>Camera trước</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="front_camera"
                                    value={formData.front_camera}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="productBackCamera">
                                <Form.Label>Camera sau</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="back_camera"
                                    value={formData.back_camera}
                                    onChange={handleInputChange}
                                />
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
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="productWarranty">
                                <Form.Label>Thời gian bảo hành (tháng)</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="warranty_period"
                                    value={formData.warranty_period}
                                    onChange={handleInputChange}
                                />
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
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="productImage">
                        <Form.Label>Hình ảnh sản phẩm</Form.Label>
                        <Form.Control
                            type="file"
                            name="imageFile"
                            onChange={handleInputChange}
                            accept="image/*"
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