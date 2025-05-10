import {useEffect, useState, useRef} from 'react';
import {Pie} from 'react-chartjs-2';
import {ArcElement, Chart as ChartJS, Legend, Tooltip} from 'chart.js';
import {Card, Col, Row} from 'react-bootstrap';
import {PRODUCT_IMAGE_PATH} from "../../../utils/Constant.jsx";

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
    '#FF9F40', '#C9CBCF', '#36EB6F', '#AF52DE', '#007AFF',
];

const TopSellingPieChart = ({data}) => {
    const [bestProduct, setBestProduct] = useState(null);
    const [worstProduct, setWorstProduct] = useState(null);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                data: [],
                backgroundColor: COLORS,
                borderColor: '#ffffff',
                borderWidth: 1,
            },
        ],
    });
    const chartContainerRef = useRef(null);


    useEffect(() => {
        const top10 = [...data].slice(0, 10);

        setBestProduct(data[0]);
        setWorstProduct(data[data.length - 1]);


        setChartData({
            labels: top10.map(p => p.sku_name),
            datasets: [
                {
                    data: top10.map(p => p.total_quantity_sold),
                    backgroundColor: COLORS,
                    borderColor: '#ffffff',
                    borderWidth: 1,
                },
            ],
        });
    }, [data]);

    const options = {
        maintainAspectRatio: true,
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'TOP 10 SẢN PHẨM BÁN CHẠY NHẤT',
                font: {
                    size: 18
                },
                color: '#333'
            }
        }
    };

    return (
        <Row className={'mt-2'}>
            <Col md={8} className="text-white p-2 rounded-3 mb-md-0">
                <Card className="h-100" ref={chartContainerRef}>
                    <Card.Body>
                        <Pie data={chartData} options={options} />
                    </Card.Body>
                </Card>
            </Col>

            <Col md={4}>
                <Row className="h-100">
                    <Col xs={12} className="text-white p-2 rounded-3 h-50">
                        {bestProduct && (
                            <Card className={'text-center h-100'}>
                                <Card.Header>
                                    <h6 className={'mb-0 fw-bold'}>🔥 BÁN NHIỀU NHẤT</h6>
                                </Card.Header>
                                <Card.Body className="d-flex flex-column">
                                    <div className="flex-grow-1 d-flex flex-column justify-content-center">
                                        <img src={`${PRODUCT_IMAGE_PATH}${bestProduct.image}`} alt={bestProduct.sku_name}
                                             className="img-fluid mb-2 mx-auto"
                                             style={{ width: '100%', height: '100%', maxWidth:  '70%', maxHeight: '70%', objectFit: 'contain' }}
                                        />
                                        <p className="mt-2 mb-1"><strong>{bestProduct.sku_name}</strong></p>
                                        <p className="mb-1">Số lượng bán: {bestProduct.total_quantity_sold}</p>
                                        <p className="mb-0">Doanh thu: {parseInt(bestProduct.total_revenue).toLocaleString('vi-VN')}₫</p>
                                    </div>
                                </Card.Body>
                            </Card>
                        )}
                    </Col>

                    <Col xs={12} className="text-white p-2 rounded-3 h-50">
                        {worstProduct && (
                            <Card className={'text-center h-100'}>
                                <Card.Header>
                                    <h6 className={'mb-0 fw-bold'}>❄️ BÁN ÍT NHẤT</h6>
                                </Card.Header>
                                <Card.Body className="d-flex flex-column">
                                    <div className="flex-grow-1 d-flex flex-column justify-content-center">
                                        <img src={`${PRODUCT_IMAGE_PATH}${worstProduct.image}`} alt={worstProduct.sku_name}
                                             className="img-fluid mb-2 mx-auto"
                                             style={{ width: '100%', height: '100%', maxWidth:  '70%', maxHeight: '70%', objectFit: 'contain' }}
                                        />
                                        <p className="mt-2 mb-1"><strong>{worstProduct.sku_name}</strong></p>
                                        <p className="mb-1">Số lượng bán: {worstProduct.total_quantity_sold}</p>
                                        <p className="mb-0">Doanh thu: {parseInt(worstProduct.total_revenue).toLocaleString('vi-VN')}₫</p>
                                    </div>
                                </Card.Body>
                            </Card>
                        )}
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

export default TopSellingPieChart;