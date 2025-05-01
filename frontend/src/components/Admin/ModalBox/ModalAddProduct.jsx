import {useState} from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { useNotificationContext } from "../../../hooks/useNotificationContext.jsx";
import {API_URL, PRODUCT_API_URL} from "../../../utils/Constant.jsx";

export default function ModalAddProduct({ show, handleClose, refreshList, optionList }) {
    const { showNotification } = useNotificationContext();
    const [imagePreview, setImagePreview] = useState(null);
    const [showAddBrand, setShowAddBrand] = useState(false);
    const [showAddProvider, setShowAddProvider] = useState(false);

    // State cho form thêm thương hiệu
    const [brandFormData, setBrandFormData] = useState({
        brand_name: ""
    });

    // State cho form thêm nhà cung cấp
    const [providerFormData, setProviderFormData] = useState({
        provider_name: "",
        phone: "",
        address: "",
        email: ""
    });

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

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else if (type === 'file') {
            const file = files[0];
            if (file) {
                setFormData(prev => ({ ...prev, image: file }));
                setImagePreview(URL.createObjectURL(file));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // Handle change cho form thêm thương hiệu
    const handleBrandChange = (e) => {
        const { name, value } = e.target;
        setBrandFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle change cho form thêm nhà cung cấp
    const handleProviderChange = (e) => {
        const { name, value } = e.target;
        setProviderFormData(prev => ({ ...prev, [name]: value }));
    };

    // Xử lý submit thêm thương hiệu
    const handleSubmitBrand = async (e) => {
        e.preventDefault();
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
            setBrandFormData({ brand_name: "" });
            setShowAddBrand(false);

            refreshList();
        } catch (error) {
            console.error(error);
            showNotification('Có lỗi xảy ra khi thêm thương hiệu', 'error');
        }
    };

    // Xử lý submit thêm nhà cung cấp
    const handleSubmitProvider = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}provider`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(providerFormData),
            });

            if (!response.ok) throw new Error('Thêm nhà cung cấp thất bại');

            const data = await response.json();
            showNotification(data.message);
            setProviderFormData({ provider_name: "", phone: "", address: "", email: "" });
            setShowAddProvider(false);
            // Refresh danh sách nhà cung cấp
            refreshList();
        } catch (error) {
            console.error(error);
            showNotification('Có lỗi xảy ra khi thêm nhà cung cấp', 'error');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (parseInt(formData.warranty_period) < 0) {
            showNotification('Thời gian bảo hành không hợp lệ', 'error');
            return;
        }
        const form = new FormData();
        for (let key in formData) {
            form.append(key, formData[key]);
        }

        try {
            const response = await fetch(`${PRODUCT_API_URL}`, {
                method: 'POST',
                body: form,
            });

            if (!response.ok) throw new Error('Thêm sản phẩm thất bại');

            const data = await response.json();

            showNotification(`${data.message}, id sản phẩm: ${data.product_id}`, `${data.status}`);
            handleClose();
            refreshList();
        } catch (error) {
            console.error(error);
            showNotification('Có lỗi xảy ra khi thêm sản phẩm');
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
                                    <Form.Label>Tên sản phẩm</Form.Label>
                                    <Form.Control name="name" value={formData.name} onChange={handleChange} required />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Series</Form.Label>
                                    <Form.Control name="series" value={formData.series} onChange={handleChange} required/>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Thương hiệu</Form.Label>
                                    <div className={'d-flex gap-2'}>
                                        <Form.Select name="brand" value={formData.brand} onChange={handleChange} required>
                                            <option value="">Chọn thương hiệu</option>
                                            {optionList?.brands && optionList.brands.map((brand) => (
                                                <option key={brand.brand_id} value={brand.brand_id}>
                                                    {brand.brand_name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                        <Button
                                            variant={'outline-success'}
                                            style={{height: '40px'}}
                                            onClick={() => setShowAddBrand(true)}
                                        >
                                            <i className="fa-solid fa-plus"></i>
                                        </Button>
                                    </div>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Nhà cung cấp</Form.Label>
                                    <div className={'d-flex gap-2'}>
                                        <Form.Select name="provider" value={formData.provider} onChange={handleChange} required>
                                            <option value="">Chọn nhà cung cấp</option>
                                            {optionList?.providers && optionList.providers.map((provider) => (
                                                <option key={provider.provider_id} value={provider.provider_id}>
                                                    {provider.provider_name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                        <Button
                                            variant={'outline-success'}
                                            style={{height: '40px'}}
                                            onClick={() => setShowAddProvider(true)}
                                        >
                                            <i className="fa-solid fa-plus"></i>
                                        </Button>
                                    </div>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>CPU</Form.Label>
                                    <Form.Control name="cpu" value={formData.cpu} onChange={handleChange} />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Màn hình</Form.Label>
                                    <Form.Control name="screen" value={formData.screen} onChange={handleChange} />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Pin</Form.Label>
                                    <Form.Control name="battery" value={formData.battery} onChange={handleChange} />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Camera trước</Form.Label>
                                    <Form.Control name="front_camera" value={formData.front_camera} onChange={handleChange} />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Camera sau</Form.Label>
                                    <Form.Control name="back_camera" value={formData.back_camera} onChange={handleChange} />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Ngày ra mắt</Form.Label>
                                    <Form.Control type="date" name="release_date" value={formData.release_date} onChange={handleChange} required/>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Thời gian bảo hành (tháng)</Form.Label>
                                    <Form.Control type="number" name="warranty_period" value={formData.warranty_period} onChange={handleChange} />
                                </Form.Group>
                            </Col>

                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label>Mô tả</Form.Label>
                                    <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleChange} />
                                </Form.Group>
                            </Col>

                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label>Hình ảnh</Form.Label>
                                    <Form.Control type="file" name="image" accept="image/*" onChange={handleChange} required />
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
                                required
                            />
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

            {/* Modal thêm nhà cung cấp */}
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
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Số điện thoại</Form.Label>
                            <Form.Control
                                type="tel"
                                name="phone"
                                value={providerFormData.phone}
                                onChange={handleProviderChange}
                                placeholder="Nhập số điện thoại"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Địa chỉ</Form.Label>
                            <Form.Control
                                type="text"
                                name="address"
                                value={providerFormData.address}
                                onChange={handleProviderChange}
                                placeholder="Nhập địa chỉ"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={providerFormData.email}
                                onChange={handleProviderChange}
                                placeholder="Nhập email"
                            />
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
    )
}