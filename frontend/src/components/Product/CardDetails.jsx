import React, { useState } from "react";
import { Container, Row, Col, Image, Button, Form, Card, Table } from "react-bootstrap";
import {PRODUCT_IMAGE_PATH} from "../../utils/Constant.jsx";
import '../../styles/CardDetails.css'

const product = {
    product_id: 1,
    brand: 1,
    series: "iPhone 14 Series",
    name: "iPhone 14 Pro Max",
    image: "iphone14promax.jpg",
    cpu: "A16 Bionic",
    screen: "6.7 inch",
    battery: "4323 mAh",
    front_camera: "12 MP",
    back_camera: "48 MP",
    description: "iPhone 14 Pro Max with new design",
    base_price: 1500,
    release_date: "2022-09-14",
    warranty_period: 12,
    status: 1,
};

const sku = [
    {
        sku_id: 1,
        product_id: 1,
        internal_id: 1,
        color_id: 1,
        sku_code: "IPHONE14PROMAX-BLACK-4GB/128GB",
        sku_name: "iPhone 14 Pro Max 4GB/128GB Black",
        image: "iphone14promaxblack.jpg",
        import_price: 1400,
        invoice_price: 1500,
        sold: 0,
        stock: 10,
        update_date: "2025-03-23 20:34:01",
        color: "Black",
        internal_option_id: 1,
        storage: "128GB",
        ram: "4GB",
    },
];

const ProductDetail = () => {
    const [selectedColor, setSelectedColor] = useState(sku[0].color);
    const [selectedStorage, setSelectedStorage] = useState(sku[0].storage);

    const uniqueColors = [...new Set(sku.map((s) => s.color))];
    const uniqueStorages = [...new Set(sku.map((s) => `${s.ram}/${s.storage}`))];

    const currentSku = sku.find(
        (s) => s.color === selectedColor && `${s.ram}/${s.storage}` === selectedStorage
    );

    const handleAddToCart = () => {
        alert(`Đã thêm vào giỏ hàng: ${currentSku?.sku_name}`);
    };

    return (
        <Container className="mt-4 p-4 rounded-5 product-detail-container">
            <Row className={"w-100 mb-2"}>
                <Col md={6}
                     className={"text-center align-content-center"}
                >
                    <Image
                        src={`${PRODUCT_IMAGE_PATH}/${currentSku?.image || product.image}`}
                        alt={product.name}
                        style={{width: '80%', height: '85%', borderRadius: '30px'}}
                    />
                </Col>

                <Col md={6}
                     className={'align-content-center'}
                >
                    <h2 className={"h2 mb-4"}
                    >
                        {product.name}
                    </h2>

                    <Form.Group className="mb-4">
                        <Form.Label>Colors</Form.Label>
                        <div>
                            {uniqueColors.map((color, idx) => (
                                <Button
                                    key={idx}
                                    variant={selectedColor === color ? "dark" : "outline-dark"}
                                    className="me-2 mb-2"
                                    onClick={() => setSelectedColor(color)}
                                >
                                    {color}
                                </Button>
                            ))}
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label>Storage</Form.Label>
                        <div>
                            {uniqueStorages.map((config, idx) => (
                                <Button
                                    key={idx}
                                    variant={selectedStorage === config ? "dark" : "outline-dark"}
                                    className="me-2 mb-2"
                                    onClick={() => setSelectedStorage(config)}
                                >
                                    {config}
                                </Button>
                            ))}
                        </div>
                    </Form.Group>

                    <p className="text-danger fs-3 ">{product.base_price.toLocaleString("de-DE") + '$'}</p>

                    <Button
                        variant="dark"
                        size="lg"
                        className="w-75 py-1 mt-2"
                        style={{height: "35px"}}
                        onClick={handleAddToCart}
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
                    <h4>PRODUCT DESCRIPTION</h4>
                    <p className={'fs-5'}>{product.description}</p>
                </Col>

                <Col md={6}
                     className={'p-0'}
                >
                    <Card className="text-center w-100 m-0" style={{ maxHeight: "150px" }}>
                        <Card.Header className="fw-bold">SPECIFICATION</Card.Header>

                        <div style={{ width: "100%", overflowY: "auto" }}>
                            <Table striped bordered hover responsive className="mb-0">
                                <tbody>
                                <tr>
                                    <td style={{width: "35%"}}>Screen</td>
                                    <td style={{width: "65%"}}>{product.screen}</td>
                                </tr>
                                <tr>
                                    <td style={{width: "35%"}}>Rear Camera</td>
                                    <td>{product.back_camera}</td>
                                </tr>
                                <tr>
                                    <td style={{width: "35%"}}>Front Camera</td>
                                    <td>{product.front_camera}</td>
                                </tr>
                                <tr>
                                    <td style={{width: "35%"}}>Chip</td>
                                    <td>{product.cpu}</td>
                                </tr>
                                <tr>
                                    <td style={{width: "35%"}}>Battery Capacity</td>
                                    <td>{product.battery}</td>
                                </tr>
                                <tr>
                                    <td style={{width: "35%"}}>RAM</td>
                                    <td>{currentSku?.ram}</td>
                                </tr>
                                <tr>
                                    <td style={{width: "35%"}}>Storage</td>
                                    <td>{currentSku?.storage}</td>
                                </tr>
                                <tr>
                                    <td style={{width: "35%"}}>Warranty</td>
                                    <td>{product.warranty_period} months</td>
                                </tr>
                                </tbody>
                            </Table>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ProductDetail;
