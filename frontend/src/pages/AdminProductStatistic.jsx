import {Badge, Col, Form, FormSelect, Row, Tab, Tabs} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {ADMIN_PRODUCT_PER_PAGE, API_URL, PRODUCT_IMAGE_PATH} from "../utils/Constant.jsx";
import CustomPagination from "../components/CustomPagination.jsx";
import {useSearchParams} from "react-router-dom";
import {useNotificationContext} from "../hooks/useNotificationContext.jsx";
import TopSellingPieChart from "../components/Admin/chart/TopSellingPieChart.jsx";

export const AdminProductStatistic = () => {

    const [sanPhamThongKe, setSanPhamThongKe] = useState([]);
    const [tongQuan, setTongQuan] = useState([]);
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [sortBy, setSortBy] = useState('product_id')
    const [sortOrder, setSortOrder] = useState('ASC')
    const [searchParams, setSearchParams] = useSearchParams();
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const {showNotification} = useNotificationContext()

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const fetchData = async () => {
            try {
                searchParams.set('limit', `${ADMIN_PRODUCT_PER_PAGE}`);
                const url = `${API_URL}statistic/product?${searchParams.toString()}`
                const response = await fetch(url, {signal});
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setTotalPages(data.totalPage)
                setCurrentPage(data.currentPage)
                setSanPhamThongKe(data.data);
            } catch (error) {
                if (error.name === 'AbortError') {
                    console.log('Fetch aborted');
                } else {
                    console.error('Error fetching data:', error);
                }
            }
        }
        fetchData()

        return () => {
            controller.abort();
        }
    }, [searchParams, setSearchParams]);

    useEffect(() => {
        if ((startDate !== '' || endDate !== '') && (new Date(endDate) < new Date(startDate))) {
            showNotification('Ngày kết thúc không được nhỏ hơn ngày bắt đầu')
            return
        }

        if (startDate !== '') {
            searchParams.set('from', startDate)
        }

        if (endDate !== '') {
            searchParams.set('to', endDate)
        }

        if (sortBy !== '') {
            searchParams.set('sort', sortBy)
        }
        if (sortOrder !== '') {
            searchParams.set('dir', sortOrder)
        }
        searchParams.delete('page')
        setSearchParams(searchParams)


    }, [startDate, endDate, sortBy, sortOrder])

    return (
        <Col>
            <Tabs
                defaultActiveKey="tongQuan"
                id="uncontrolled-tab-example"
                className="w-100 text-center"
                style={{ backgroundColor: 'lightgray', borderRadius: '5px', borderBottom: '1px solid black' }}
                justify
            >
                <Tab eventKey="tongQuan" title="Tổng quan">
                    {sanPhamThongKe && (<TopSellingPieChart data={sanPhamThongKe}/>)}
                </Tab>
                <Tab eventKey={'chiTiet'} title={'Chi tiết'}>
                    <Row className={"text-center"}>
                        <Col className='user-statistic-controller d-flex justify-content-center align-items-center'>
                            <Form.Label
                                style={{width: '120px'}}
                            >Từ ngày</Form.Label>
                            <Form.Control type="date"
                                          className={'m-auto'}
                                          value={startDate}
                                          onChange={(e) => {
                                              setStartDate(e.target.value)
                                          }}
                            />
                            <Form.Label
                                style={{width: '120px'}}
                            >Đến ngày</Form.Label>
                            <Form.Control type="date"
                                          className={'m-auto'}
                                          value={endDate}
                                          min={startDate || undefined}
                                          onChange={(e) => {
                                              setEndDate(e.target.value)
                                          }}
                            />
                            <div className={'w-100 d-flex align-items-center mx-3 gap-3'}>
                                <FormSelect
                                    className={'w-100 my-3'}
                                    style={{maxWidth: '300px'}}
                                    value={sortBy}
                                    onChange={(e) => {
                                        setSortBy(e.target.value)
                                    }}
                                >
                                    <option value="product_id">Mã SP</option>
                                    <option value="sku_id">Mã PB</option>
                                    <option value="import_price">Giá nhập</option>
                                    <option value="invoice_price">Giá bán</option>
                                    <option value="stock">SL tồn</option>
                                    <option value="total_quantity_sold">SL đã bán</option>
                                    <option value="total_cost">Tổng tiền nhập</option>
                                    <option value="total_revenue">Tổng tiền bán</option>
                                </FormSelect>
                                <button onClick={() => {
                                    setSortOrder('ASC')
                                }}>Tăng
                                </button>

                                <button onClick={() => {
                                    setSortOrder('DESC')
                                }}>Giảm
                                </button>

                                <button
                                    onClick={() => {
                                        setStartDate('')
                                        setEndDate('')
                                        setSortBy('product_id')
                                        setSortOrder('ASC')
                                        searchParams.delete('from')
                                        searchParams.delete('to')
                                        searchParams.delete('sort')
                                        searchParams.delete('dir')
                                        setSearchParams(searchParams)
                                    }}
                                >
                                    <i className='fa-solid fa-rotate-right'></i>Refresh
                                </button>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <div style={{maxHeight: '630px', overflowY: "auto"}}>
                                <div className='product-statistic-header'>
                                    <span>Mã SP</span>
                                    <span>Mã PB</span>
                                    <span>Tên sản phẩm</span>
                                    <span>Hình ảnh</span>
                                    <span>Giá nhập</span>
                                    <span>Giá bán</span>
                                    <span>SL tồn</span>
                                    <span>SL đã bán</span>
                                    <span>Tổng tiền mua</span>
                                    <span>Tổng tiền bán</span>
                                </div>
                            </div>
                            {sanPhamThongKe && sanPhamThongKe.map((item, index) => (
                                <div className='product-statistic-info' key={index}>
                                    <span>{item.product_id}</span>
                                    <span>{item.sku_id}</span>
                                    <span>{item.sku_name}</span>
                                    <span>
                                <img
                                    src={`${PRODUCT_IMAGE_PATH}${item.image}`}
                                    alt={item.sku_name}
                                    style={{width: '70px', height: '70px', cursor: 'pointer'}}
                                />
                            </span>
                                    <span>{item.import_price.toLocaleString('vi-VN')}đ</span>
                                    <span>{item.invoice_price.toLocaleString('vi-VN')}đ</span>
                                    <span>
                                <Badge bg={item.stock > 0 ? 'success' : 'danger'}>
                                    {item.stock}
                                </Badge>
                            </span>
                                    <span>
                                <Badge bg={item.total_quantity_sold > 0 ? 'success' : 'danger'}>
                                    {item.total_quantity_sold}
                                </Badge>
                            </span>
                                    <span>{parseInt(item.total_cost).toLocaleString('vi-VN')}đ</span>
                                    <span>{parseInt(item.total_revenue).toLocaleString('vi-VN')}đ</span>
                                </div>
                            ))}
                            {totalPages > 1 && (<CustomPagination
                                currentPage={currentPage}
                                totalPage={totalPages}
                                searchParams={searchParams}
                                setSearchParams={setSearchParams}
                            />)}
                        </Col>
                    </Row>
                </Tab>
            </Tabs>
        </Col>
    )
}