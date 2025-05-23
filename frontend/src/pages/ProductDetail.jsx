import {useEffect, useState} from "react";
import {Row, Col, Image, Button,  Card, Table } from "react-bootstrap";
import {PRODUCT_API_URL, PRODUCT_IMAGE_PATH} from "../utils/Constant.jsx";
import '../styles/ProductDetails.css'
import {useLocation} from "react-router-dom";

import { useAddToCart } from "../hooks/useAddToCart.jsx";

const ProductDetail = () => {
    const [productDetail, setProductDetail] = useState(
        {product: {}, sku: []}
    );
    const [sku, setSku] = useState(null);
    const [uniqueColors, setUniqueColors] = useState([]);
    const [uniqueStorages, setUniqueStorages] = useState([]);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedStorage, setSelectedStorage] = useState(null);
    const [productImage, setProductImage] = useState('');
    const [quantity, setQuantity] = useState(0);

    const location = useLocation();
    const id = location.pathname.split("/").pop();

    const { addToCart } = useAddToCart()



    useEffect(() => {
        window.scrollTo({ top: 0 });
        const controller = new AbortController();
        const fetchProductDetail = async () => {
            try {
                const response = await fetch(`${PRODUCT_API_URL}/${id}`, { signal: controller.signal });
                if (!response.ok) {
                    throw new Error('Failed to fetch product detail');
                }
                const data = await response.json();
                console.log(data);
                setProductDetail(data);
            } catch (error) {
                if (error.name === 'AbortError') {
                    console.log('Fetch aborted');
                } else {
                    console.error(error);
                }
            }
        }
        fetchProductDetail()
        return () => controller.abort();
    }, [id]);

    useEffect(() => {
        if (productDetail) {
            const colors = Array.from(
                new Map(
                    productDetail.sku.map((sku) => [
                        sku.color_id,
                        { color_id: sku.color_id, color: sku.color },
                    ])
                ).values()
            );
            setProductImage(`${PRODUCT_IMAGE_PATH}${productDetail.product.image}`);
            setUniqueColors(colors);
            const countQuantity = productDetail.sku.reduce((acc, sku) => {
                if (sku.stock > 0) {
                    return acc + sku.stock;
                }
                return acc;
            }, 0);
            setQuantity(countQuantity);
        }
    }, [productDetail]);

    useEffect(() => {
        if (selectedColor) {
            const storages = Array.from(
                new Map(
                    productDetail.sku
                        .filter((sku) => sku.color_id === selectedColor.color_id)
                        .map((sku) => [
                            sku.internal_id,
                            {internal_id: sku.internal_id, storage: `${sku.ram}/${sku.storage}`}
                        ])
                ).values()
            ).sort((a, b) => a.internal_id - b.internal_id)
            setUniqueStorages(storages);
            setSelectedStorage(storages[0]);
        } else {
            setUniqueStorages([]);
        }
    }, [selectedColor]);

    useEffect(() => {
        if (selectedStorage && selectedColor) {
            const selectedSku = productDetail.sku.find(
                (sku) => sku.internal_id === selectedStorage.internal_id && sku.color_id === selectedColor.color_id
            );
            setSku(selectedSku || null);
            setQuantity(selectedSku.stock);
        }
    }, [selectedStorage]);

    useEffect(() => {
        if (sku) {
            setProductImage(`${PRODUCT_IMAGE_PATH}${sku.image}`);
        }
    }, [sku]);

    return (
        <div className="mt-4 p-4 rounded-5 product-detail-container container product">
            <Row className={"w-100 mb-5"}>
                <Col md={6}
                     className={"text-center align-content-center"}
                >
                    <div className={'text-center'}
                    >
                        <Image
                            src={productImage? productImage : null}
                            alt={productDetail.name}
                            style={{width: '100%', height: '100%', borderRadius: '30px', maxWidth: '400px', maxHeight: '400px'}}
                        />
                    </div>
                </Col>

                <Col md={6}
                     className={'align-content-center'}
                     style={{paddingRight: ''}}
                >
                    <h2 className={"h2 mb-4 mt-3"}
                    >
                        {sku ? sku.sku_name : productDetail.product.name}
                    </h2>

                    <h6 className={"mb-4 mt-3"}
                        style={{color: "gray"}}
                    >
                        Số lượng: {quantity}
                    </h6>

                    {uniqueColors.length > 0 && (
                        <div className="mb-4">
                            <h3 className="h5 mb-0">Màu sắc</h3>
                            <div className="d-flex flex-wrap" style={{ marginTop: "30px" }}>
                                {uniqueColors.map((color, index) => (
                                    <Button
                                        key={index}
                                        variant={selectedColor === color ? "dark" : "outline-dark"}
                                        className="me-2 mb-2"
                                        onClick={() => setSelectedColor(color)}
                                    >
                                        {color.color}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}

                    {uniqueStorages.length > 0 && (
                        <div className="mb-4">
                            <h3 className="h5 mb-0">Dung lượng</h3>
                            <div className="d-flex flex-wrap" style={{ marginTop: "30px" }}>
                                {uniqueStorages
                                    .sort((a, b) => a.internal_id - b.internal_id)
                                    .map((storage, index) => (
                                        <Button
                                            key={index}
                                            variant={selectedStorage.internal_id === storage.internal_id ? "dark" : "outline-dark"}
                                            className="me-2 mb-2"
                                            onClick={() => setSelectedStorage(storage)}
                                        >
                                            {storage.storage}
                                        </Button>
                                    ))}
                            </div>
                        </div>
                    )}


                    <p className="text-danger fs-3">{(sku? sku.invoice_price?.toLocaleString("vi-VN") : productDetail.product.base_price?.toLocaleString("vi-VN")) + "đ"}</p>

                    <Button
                        variant="dark"
                        size="lg"
                        className="w-100 py-1 mt-2 rounded-4"
                        style={{height: "40px"}}
                        onClick={() => addToCart(sku)}
                        disabled={!sku || sku.stock === 0}
                    >
                        Thêm vào giỏ hàng
                    </Button>
                </Col>
            </Row>

            <hr className="my-4"/>

            <Row className={"w-100"}>
                <Col md={6}
                     className={'text-center mt-2'}
                >
                    <h4>Mô tả sản phẩm</h4>
                    <p className={'fs-5'}>{productDetail.product.description}</p>
                </Col>

                <Col md={6}
                     className={'p-0'}
                >
                    <Card className="text-center w-100 m-0" style={{ maxHeight: "250px" }}>
                        <Card.Header className="fw-bold">Mô tả chi tiết</Card.Header>

                        <div style={{ width: "100%", overflowY: "auto" }}>
                            <Table striped bordered hover responsive className="mb-0">
                                <tbody>
                                <tr>
                                    <td style={{width: "35%"}}>Màn hình</td>
                                    <td style={{width: "65%"}}>{productDetail.product.screen}</td>
                                </tr>
                                <tr>
                                    <td style={{width: "35%"}}>Camera Trước</td>
                                    <td>{productDetail.product.front_camera}</td>
                                </tr>
                                <tr>
                                    <td style={{width: "35%"}}>Camera Sau</td>
                                    <td>{productDetail.product.back_camera}</td>
                                </tr>
                                <tr>
                                    <td style={{width: "35%"}}>Chip</td>
                                    <td>{productDetail.product.cpu}</td>
                                </tr>
                                <tr>
                                    <td style={{width: "35%"}}>Dung lượng pin</td>
                                    <td>{productDetail.product.battery}</td>
                                </tr>
                                <tr>
                                    <td style={{width: "35%"}}>RAM</td>
                                    <td>{sku?.ram}</td>
                                </tr>
                                <tr>
                                    <td style={{width: "35%"}}>Bộ nhớ</td>
                                    <td>{sku?.storage}</td>
                                </tr>
                                <tr>
                                    <td style={{width: "35%"}}>Bảo hành</td>
                                    <td>{productDetail.product.warranty_period} tháng</td>
                                </tr>
                                </tbody>
                            </Table>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ProductDetail;
