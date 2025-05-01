import {useEffect, useReducer} from 'react';
import {Modal, Button, Table, Row, Col, Badge, Image} from 'react-bootstrap';
import {API_URL, PRODUCT_IMAGE_PATH} from "../../../utils/Constant.jsx";
import ModalAddSku from './ModalAddSku';

const initialState = {
    skuList: [],
    showAddSkuModal: false,
    showEditSkuModal: false,
    showDeleteSkuModal: false,
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_SKU_LIST': return { ...state, skuList: action.payload };
        case 'SET_SHOW_ADD_SKU_MODAL': return { ...state, showAddSkuModal: action.payload };
        case 'SET_SHOW_EDIT_SKU_MODAL': return { ...state, showEditSkuModal: action.payload };
        case 'SET_SHOW_DELETE_SKU_MODAL': return { ...state, showDeleteSkuModal: action.payload };
        default: return state;
    }
}

const ModalDetailProduct = ({ show, handleClose, product, hasPermission }) => {

    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const fetchSkuList = async () => {
            try {
                const response = await fetch(`${API_URL}sku/${product.product_id}`, { signal });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                dispatch({ type: 'SET_SKU_LIST', payload: data });
            } catch (error) {
                if (error.name === 'AbortError') {
                    console.log('Fetch aborted');
                } else {
                    console.error('Error fetching SKU list:', error);
                }
            }
        }

        fetchSkuList();
        return () => {
            controller.abort();
        }
    }, [product.product_id]);

    const handleShowAddSkuModal = () => {
        dispatch({ type: 'SET_SHOW_ADD_SKU_MODAL', payload: true });
    };

    const handleCloseAddSkuModal = () => {
        dispatch({ type: 'SET_SHOW_ADD_SKU_MODAL', payload: false });
    };

    const handleSkuAdded = async () => {
        // Refresh the SKU list after a new SKU is added
        try {
            const response = await fetch(`${API_URL}sku/${product.product_id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            dispatch({ type: 'SET_SKU_LIST', payload: data });
        } catch (error) {
            console.error('Error fetching updated SKU list:', error);
        }
    };

    return (
        <Modal
            show={show}
            onHide={handleClose}
            size="xl"
            fullscreen={true}
            centered
            backdrop="static"
            keyboard={false}
        >
            <div style={{background: 'linear-gradient(to right, var(--yellow), #ffd454, #ffc454,#ffa454)', paddingRight: '20px'}}>
                <Modal.Header closeButton>
                    <Modal.Title>Chi tiết sản phẩm</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {product && (
                        <>
                            <Row className="mb-4">
                                <Col md={4} className="text-center">
                                    <img
                                        src={`${PRODUCT_IMAGE_PATH}${product.image}`}
                                        alt={product.name}
                                        style={{ width: '200px', height: '200px', objectFit: 'contain' }}
                                        className="img-thumbnail"
                                    />
                                </Col>
                                <Col md={8}>
                                    <h4>{product.name}</h4>
                                    <div className="product-details">
                                        <p><strong>ID:</strong> {product.product_id}</p>
                                        <p><strong>Hãng:</strong> {product.brand_name}</p>
                                        <p><strong>Series:</strong> {product.series}</p>
                                        <p><strong>Giá cơ bản:</strong> {product.base_price?.toLocaleString('vi-VN')}đ</p>
                                        <p><strong>Ngày ra mắt:</strong> {new Date(product.release_date).toLocaleDateString('vi-VN')}</p>
                                        <p>
                                            <strong>Trạng thái:</strong>{' '}
                                            <Badge bg={product.status ? "success" : "danger"}>
                                                {product.status ? "Đang kinh doanh" : "Ngừng kinh doanh"}
                                            </Badge>
                                        </p>
                                        <p><strong>Mô tả:</strong> {product.description}</p>
                                    </div>
                                </Col>
                            </Row>

                            <Row className="mb-4">
                                <Col>
                                    <h5>Thông số kỹ thuật</h5>
                                    <Table bordered striped>
                                        <tbody>
                                        <tr>
                                            <td><strong>CPU</strong></td>
                                            <td>{product.cpu}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Màn hình</strong></td>
                                            <td>{product.screen}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Pin</strong></td>
                                            <td>{product.battery}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Camera trước</strong></td>
                                            <td>{product.front_camera}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Camera sau</strong></td>
                                            <td>{product.back_camera}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Thời gian bảo hành</strong></td>
                                            <td>{product.warranty_period} tháng</td>
                                        </tr>
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>

                            <Row className="mb-4">
                                <Col>
                                    <h5>Nhà cung cấp</h5>
                                    <Table bordered striped>
                                        <tbody>
                                        <tr>
                                            <td><strong>Tên nhà cung cấp</strong></td>
                                            <td>{product.provider_name}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Địa chỉ</strong></td>
                                            <td>{product.address}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Số điện thoại</strong></td>
                                            <td>{product.phone}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Email</strong></td>
                                            <td>{product.email}</td>
                                        </tr>
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <div className={'w-100 d-flex justify-content-between align-items-center mb-3'}>
                                        <h5>Danh sách phiên bản</h5>
                                        {hasPermission("Thêm") && (
                                            <Button
                                                variant="success"
                                                onClick={handleShowAddSkuModal}
                                            >
                                                + Thêm phiên bản
                                            </Button>
                                        )}
                                    </div>
                                    <Table bordered striped className="text-center" style={{verticalAlign: 'middle'}}>
                                        <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Mã phiên bản</th>
                                            <th>Hình ảnh</th>
                                            <th>Tên</th>
                                            <th>Màu sắc</th>
                                            <th>RAM</th>
                                            <th>Bộ nhớ</th>
                                            <th>Giá nhập</th>
                                            <th>Giá bán</th>
                                            <th>Đã bán</th>
                                            <th>Tồn kho</th>
                                            <th>Cập nhật lần cuối</th>
                                            <th colSpan={2}>Thao tác</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {state.skuList && state.skuList.map((sku) => (
                                            <tr key={sku.sku_id}>
                                                <td>{sku.sku_id}</td>
                                                <td>{sku.sku_code}</td>
                                                <td>
                                                    <Image
                                                        src={`${PRODUCT_IMAGE_PATH}${sku.image}`}
                                                        alt={sku.sku_name}
                                                        style={{ width: '70px', height: '70px', cursor: 'pointer' }}
                                                    />
                                                </td>
                                                <td>{sku.sku_name}</td>
                                                <td>
                                                    <div
                                                        className="color-box"
                                                        style={{
                                                            backgroundColor: sku.color.toLowerCase(),
                                                            width: '20px',
                                                            height: '20px',
                                                            borderRadius: '50%',
                                                            margin: '0 auto',
                                                            border: '1px solid black'
                                                        }}
                                                        title={sku.color}
                                                    />
                                                    {sku.color}
                                                </td>
                                                <td>{sku.ram}</td>
                                                <td>{sku.storage}</td>
                                                <td>{sku.import_price.toLocaleString('vi-VN')}đ</td>
                                                <td>{sku.invoice_price.toLocaleString('vi-VN')}đ</td>
                                                <td>{sku.sold}</td>
                                                <td>
                                                    <Badge bg={sku.stock > 0 ? "success" : "danger"}>
                                                        {sku.stock}
                                                    </Badge>
                                                </td>
                                                <td>{new Date(sku.update_date).toLocaleString('vi-VN')}</td>
                                                <td>
                                                    {hasPermission("Sửa") && (<Button variant="warning" size="sm">
                                                        <i className="fas fa-edit"></i>
                                                    </Button>)}
                                                </td>
                                                <td>
                                                    {hasPermission("Xóa") && (<Button variant="danger" size="sm">
                                                        <i className="fas fa-trash"></i>
                                                    </Button>)}
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>

                            <ModalAddSku
                                show={state.showAddSkuModal}
                                handleClose={handleCloseAddSkuModal}
                                productId={product.product_id}
                                onSkuAdded={handleSkuAdded}
                            />
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </div>
        </Modal>
    );
};

export default ModalDetailProduct;