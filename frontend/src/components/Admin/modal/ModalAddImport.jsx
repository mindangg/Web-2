import {useState, useEffect, useRef} from 'react';
import { Modal, Button, Form, Table, Row, Col } from 'react-bootstrap';
import {API_URL} from "../../../utils/Constant.jsx";
import {useAdminContext} from "../../../hooks/useAdminContext.jsx";

const ModalAddImport = ({ show, handleClose, onSave }) => {
    const {admin} = useAdminContext();
    const [providers, setProviders] = useState([]);
    const [selectedProvider, setSelectedProvider] = useState();
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const inputRef = useRef(null);

    const handleFocus = (event) => {
        event.target.select();
    };

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        const fetchProviders = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_URL}provider`, {
                    method: "GET",
                    headers: {"Content-Type": "application/json"},
                    signal
                })
                const data = await response.json();
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                setProviders(data.providers);
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('Error fetching providers:', error);
                } else {
                    console.log('Fetch aborted:', error);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProviders();

        return () => {
            controller.abort();
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        const fetchProducts = async () => {
            if (!selectedProvider) {
                setProducts([]);
                return;
            }

            setLoading(true);
            try {
                const response = await fetch(`${API_URL}import/provider/${selectedProvider}`, {
                    method: "GET",
                    headers: {"Content-Type": "application/json"},
                    signal
                })
                const data = await response.json();
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                setProducts(data.products);
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('Error fetching products:', error);
                } else {
                    console.log('Fetch aborted:', error);
                }
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
        return () => {
            controller.abort();
        }
    }, [selectedProvider]);

    useEffect(() => {
        const newTotal = selectedProducts.reduce((sum, product) => {
            return sum + (product.quantity * product.importPrice);
        }, 0);
        setTotal(newTotal);
    }, [selectedProducts]);

    const handleProviderChange = (e) => {
        setSelectedProvider(e.target.value);
        setSelectedProducts([]);
    };

    const handleProductSelect = (sku) => {
        const existingIndex = selectedProducts.findIndex(p => p.skuId === sku.sku_id);
        if (existingIndex >= 0) {
            const updatedProducts = [...selectedProducts];
            updatedProducts.splice(existingIndex, 1);
            setSelectedProducts(updatedProducts);
        } else {
            setSelectedProducts([
                ...selectedProducts,
                {
                    skuId: sku.sku_id,
                    productName: sku.sku_name,
                    quantity: 1,
                    importPrice: sku.import_price || 0
                }
            ]);
        }
    };

    const handleQuantityChange = (skuId, quantity) => {
        if (quantity < 1) {
            quantity = 1;
        }
        const updatedProducts = selectedProducts.map(product => {
            if (product.skuId === skuId) {
                return { ...product, quantity: parseInt(quantity) || 0 };
            }
            return product;
        });
        setSelectedProducts(updatedProducts);
    };

    const handlePriceChange = (skuId, price) => {
        if (price < 0) {
            price = 0;
        }
        const updatedProducts = selectedProducts.map(product => {
            if (product.skuId === skuId) {
                return { ...product, importPrice: parseInt(price) || 0 };
            }
            return product;
        });
        setSelectedProducts(updatedProducts);
    };

    const handleSubmit = () => {
        const importOrder = {
            employeeId: admin?.employee[0]?.employee_id,
            providerId: selectedProvider,
            total: total,
            details: selectedProducts.map(product => ({
                skuId: product.skuId,
                quantity: product.quantity,
                price: product.importPrice
            }))
        };

        onSave(importOrder);

        setSelectedProvider('');
        setSelectedProducts([]);
        handleClose();
    };

    const isProductSelected = (skuId) => {
        return selectedProducts.some(p => p.skuId === skuId);
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Tạo đơn nhập hàng</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Nhà cung cấp</Form.Label>
                        <Form.Select
                            value={selectedProvider}
                            onChange={handleProviderChange}
                        >
                            <option value="">Chọn nhà cung cấp</option>
                            {providers.map(provider => (
                                <option key={provider.provider_id} value={provider.provider_id}>
                                    {provider.provider_name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    {loading ? (
                        <div className="text-center">Đang tải...</div>
                    ) : (
                        <>
                            {selectedProvider && (
                                <>
                                    <h5 className="mt-4">Danh sách sản phẩm</h5>
                                    {products.length === 0 ? (
                                        <p>Không có sản phẩm nào từ nhà cung cấp này</p>
                                    ) : (
                                        <Table striped bordered hover responsive>
                                            <thead>
                                            <tr>
                                                <th style={{ width: '5%' }}></th>
                                                <th style={{ width: '5%' }}>Mã</th>
                                                <th style={{ width: '30%' }}>Tên sản phẩm</th>
                                                <th style={{ width: '20%' }}>Mã SKU</th>
                                                <th style={{ width: '20%' }}>Màu sắc</th>
                                                <th style={{ width: '20%' }}>Bộ nhớ</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {products.map(sku => (
                                                <tr
                                                    key={sku.sku_id}
                                                    className={(isProductSelected(sku.sku_id) ? 'table-primary' : '')}
                                                    onClick={() => handleProductSelect(sku)}
                                                >
                                                    <td>
                                                        <Form.Check
                                                            type="checkbox"
                                                            checked={isProductSelected(sku.sku_id)}
                                                            onChange={() => {}}
                                                            style={{ cursor: 'pointer'}}
                                                        />
                                                    </td>
                                                    <td>{sku.sku_id}</td>
                                                    <td>{sku.sku_name}</td>
                                                    <td>{sku.sku_code}</td>
                                                    <td>{sku.color}</td>
                                                    <td>{sku.internal}</td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </Table>
                                    )}
                                </>
                            )}

                            {selectedProducts.length > 0 && (
                                <>
                                    <h5 className="mt-4">Sản phẩm đã chọn</h5>
                                    <Table striped bordered hover>
                                        <thead>
                                        <tr>
                                            <th style={{ width: '5%' }}>Mã</th>
                                            <th style={{ width: '35%' }}>Tên sản phẩm</th>
                                            <th style={{ width: '20%' }}>Số lượng</th>
                                            <th style={{ width: '20%' }}>Giá nhập (VNĐ)</th>
                                            <th style={{ width: '20%' }}>Thành tiền</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {selectedProducts.map(product => (
                                            <tr key={product.skuId}>
                                                <td>{product.skuId}</td>
                                                <td>{product.productName}</td>
                                                <td>
                                                    <Form.Control
                                                        type="number"
                                                        min="1"
                                                        onFocus={handleFocus}
                                                        ref={inputRef}
                                                        value={product.quantity}
                                                        onChange={(e) => handleQuantityChange(product.skuId, e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    <Form.Control
                                                        type="number"
                                                        min="0"
                                                        onFocus={handleFocus}
                                                        ref={inputRef}
                                                        value={product.importPrice}
                                                        onChange={(e) => handlePriceChange(product.skuId, e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    {(product.quantity * product.importPrice).toLocaleString()}đ
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </Table>

                                    <Row className="mt-3">
                                        <Col className="text-end">
                                            <h5>Tổng tiền: {total.toLocaleString()}đ</h5>
                                        </Col>
                                    </Row>
                                </>
                            )}
                        </>
                    )}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Hủy
                </Button>
                <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={selectedProducts.length === 0}
                >
                    Lưu đơn nhập hàng
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalAddImport;