import React, {useEffect, useState} from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Card, Row, Col } from 'react-bootstrap';
import {PRODUCT_IMAGE_PATH} from "../../../utils/Constant.jsx";

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
    '#FF9F40', '#C9CBCF', '#36EB6F', '#AF52DE', '#007AFF',
];

const TopSellingPieChart= ({ data }) => {
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


    useEffect(() => {

        const sortedData = [...data].sort((a, b) => b.total_quantity_sold - a.total_quantity_sold);
        const top10 = sortedData.slice(0, 10);

        setBestProduct(sortedData[0]);
        setWorstProduct(sortedData.find(p => p.total_quantity_sold > 0)
            ? sortedData.filter(p => p.total_quantity_sold > 0).slice(-1)[0]
            : sortedData[sortedData.length - 1])


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

    return (
        <Row>
            <Col md={8}>
                <Card>
                    <Card.Body>
                        <h5>Top 10 sản phẩm bán chạy nhất</h5>
                        <Pie data={chartData} />
                    </Card.Body>
                </Card>
            </Col>

            <Col md={4}>
                {bestProduct && (<Card className="mb-3">
                    <Card.Body>
                        <h6>🔥 Bán chạy nhất</h6>
                        <img src={`${PRODUCT_IMAGE_PATH}${bestProduct.image}`} alt={bestProduct.sku_name}
                             className="img-fluid mb-2"/>
                        <p><strong>{bestProduct.sku_name}</strong></p>
                        <p>Số lượng bán: {bestProduct.total_quantity_sold}</p>
                        <p>Doanh thu: {bestProduct.total_revenue.toLocaleString()}₫</p>
                    </Card.Body>
                </Card>)}

                {worstProduct && (<Card>
                    <Card.Body>
                        <h6>❄️ Ế nhất</h6>
                        <img src={`${PRODUCT_IMAGE_PATH}${worstProduct.image}`} alt={worstProduct.sku_name}
                             className="img-fluid mb-2"/>
                        <p><strong>{worstProduct.sku_name}</strong></p>
                        <p>Số lượng bán: {worstProduct.total_quantity_sold}</p>
                        <p>Doanh thu: {worstProduct.total_revenue.toLocaleString()}₫</p>
                    </Card.Body>
                </Card>)}
            </Col>
        </Row>
    );
};

export default TopSellingPieChart;
