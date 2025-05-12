import {Button, Col, Container, Row} from "react-bootstrap";
import {useEffect, useState} from "react";
import AdminOrderStatistic from "./AdminOrderStatistic.jsx";
import AdminUserStatistic from "./AdminUserStatistic.jsx";
import {AdminProductStatistic} from "./AdminProductStatistic.jsx";
import AdminImportStatistic from "./AdminImportStatistic.jsx";

const AdminStatistic = () => {
    const [toggle, setToggle] = useState('revenue')

    const renderContent = () => {
        switch (toggle){
            case 'revenue':
                return (
                    <Col>
                        <AdminOrderStatistic/>
                    </Col>
                )
            case 'customer':
                return (
                    <Col>
                        <AdminUserStatistic/>
                    </Col>
                )
            case 'product':
                return (
                    <Col>
                        <AdminProductStatistic/>
                    </Col>
                )
            case 'import':
                return (
                    <Col>
                        <AdminImportStatistic/>
                    </Col>
                )
        }
    }

    return (
        <Container fluid className={"w-100 h-100 rounded-3"}
                   style={{background: "linear-gradient(to right, rgb(246, 247, 244), rgb(237, 243, 230), rgb(234, 245, 234), rgb(227, 245, 227))"}}
        >
            <Row className={"h-15 text-center w-100 mx-0"}>
                <Col className={"text-center"}>
                    <Row className={'mt-3'}>
                        <Col className={'d-flex justify-content-between'}>
                            <Button className={"mx-2 w-25 h-100"} variant={'primary'} onClick={() => {setToggle('revenue')}}>Thông kê doanh thu</Button>
                            <Button className={"mx-2 w-25 h-100"} variant={'success'} onClick={() => {setToggle('product')}}>Thông kê sản phẩm</Button>
                            <Button className={"mx-2 w-25 h-100"} variant={'danger'} onClick={() => {setToggle('customer')}}>Thống kê khách hàng</Button>
                            <Button className={"mx-2 w-25 h-100"} variant={'warning'} onClick={() => {setToggle('import')}}>Thống kê nhập hàng</Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row className={'mt-3'}>
                {renderContent()}
            </Row>
        </Container>
    );

}

export default AdminStatistic;