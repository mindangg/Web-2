import {Badge, Col, Form, FormSelect, Row, Tab, Tabs} from "react-bootstrap";
import {useEffect, useState} from "react";
import {API_URL, PRODUCT_IMAGE_PATH} from "../utils/Constant.jsx";
import CustomPagination from "../components/CustomPagination.jsx";
import {useSearchParams} from "react-router-dom";
import {useNotificationContext} from "../hooks/useNotificationContext.jsx";
import TopSellingPieChart from "../components/Admin/chart/TopSellingPieChart.jsx";
import {useAdminContext} from "../hooks/useAdminContext.jsx";
import ModalDetailProductStatistic from "../components/Admin/modal/ModalDetailProductStatistic.jsx";

export const AdminProductStatistic = () => {

    const {admin} = useAdminContext()
    const [sanPhamThongKe, setSanPhamThongKe] = useState([]);
    const [tongQuan, setTongQuan] = useState([]);
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [sortBy, setSortBy] = useState('product_id')
    const [sortOrder, setSortOrder] = useState('ASC')
    const [searchParams, setSearchParams] = useSearchParams();
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [searchBy, setSearchBy] = useState('sku_name')
    const [searchValue, setSearchValue] = useState('')
    const [showModalDetail, setShowModalDetail] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState({
        sku_id: '',
        sku_name: '',
        import_price: 0,
        invoice_price: 0,
    })
    const {showNotification} = useNotificationContext()

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const fetchData = async () => {
            try {
                const url = `${API_URL}statistic/product?limit=7&${searchParams.toString()}`
                const response = await fetch(url, {
                    signal: signal,
                    headers: {
                        'Authorization': `Bearer ${admin.token}`
                    }
                });
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
        const controller = new AbortController();
        const signal = controller.signal;
        const fetchData = async () => {
            try {
                const url = `${API_URL}statistic/product-overview`
                const response = await fetch(url, {
                    signal: signal,
                    headers: {
                        'Authorization': `Bearer ${admin.token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setTongQuan(data);
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
    }, [])

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

        if (searchBy !== '') {
            searchParams.set('searchBy', searchBy)
        }

        if (searchValue !== '') {
            searchParams.set('search', searchValue)
        }
        searchParams.delete('page')
        setSearchParams(searchParams)


    }, [startDate, endDate, sortBy, sortOrder, searchBy, searchValue])

    return (
        <Col>
            <Tabs
                defaultActiveKey="tongQuan"
                id="uncontrolled-tab-example"
                className="w-100 mb-4 text-center"
                style={{backgroundColor: 'lightgray', borderRadius: '5px', borderBottom: '1px solid black'}}
                justify
            >
                <Tab eventKey="tongQuan" title="Tổng quan">
                    {tongQuan && (<TopSellingPieChart data={tongQuan}/>)}
                </Tab>
                <Tab eventKey={'chiTiet'} title={'Chi tiết'}>
                    <Row className={"text-center"}>
                        <Col
                            className='user-statistic-controller d-flex justify-content-center align-items-center gap-2'>
                            <FormSelect
                                className={'mb'}
                                style={{width: '50%'}}
                                value={searchBy}
                                onChange={(e) => {
                                    setSearchBy(e.target.value)
                                }}
                            >
                                <option value="product_id">Mã SP</option>
                                <option value="sku_id">Mã PB</option>
                                <option value="sku_name">Tên SP</option>
                            </FormSelect>
                            <Form.Control
                                type="text"
                                style={{width: '50%'}}
                                className={'m-auto p-2'}
                                placeholder={'Nhập từ khóa...'}
                                value={searchValue}
                                onChange={(e) => {
                                    setSearchValue(e.target.value)
                                }}
                            />
                            <Form.Control type="date"
                                          className={'m-auto'}
                                          value={startDate}
                                          onChange={(e) => {
                                              setStartDate(e.target.value)
                                          }}
                            />
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
                                    className={'w-100'}
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
                                        searchParams.delete('searchBy')
                                        searchParams.delete('search')
                                        searchParams.set('page', '1')
                                        setSearchParams(searchParams)
                                    }}
                                >
                                    <i className='fa-solid fa-rotate-right'></i>
                                </button>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <div style={{maxHeight: '630px', overflowY: "auto"}}>
                                <div className='product-statistic-header'>
                                    <span>Mã</span>
                                    <span>Tên sản phẩm</span>
                                    <span>Hình ảnh</span>
                                    <span>Giá nhập</span>
                                    <span>Giá bán</span>
                                    <span>SL tồn</span>
                                    <span>SL nhập</span>
                                    <span>SL bán</span>
                                    <span>Tổng tiền nhập</span>
                                    <span>Tổng tiền bán</span>
                                </div>
                            </div>
                            {sanPhamThongKe && sanPhamThongKe.map((item, index) => (
                                <div className='product-statistic-info' key={index}
                                     onClick={() => {
                                         setShowModalDetail(true);
                                         setSelectedProduct({
                                             sku_id: item.sku_id,
                                             sku_name: item.sku_name,
                                             import_price: item.import_price,
                                             invoice_price: item.invoice_price,
                                         })
                                     }}
                                >
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
                                        <Badge bg={item.total_quantity_imported > 0 ? 'success' : 'danger'}>
                                            {item.total_quantity_imported}
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
            {showModalDetail && selectedProduct && (
                <ModalDetailProductStatistic
                    show={showModalDetail}
                    onClose={() => {
                        setShowModalDetail(false)
                    }}
                    selectedProduct={selectedProduct}
                />
            )}
        </Col>
    )
}