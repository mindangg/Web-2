import {useEffect, useReducer} from 'react'

import '../styles/Admin.css'
import '../styles/Admin/AdminProduct.css'

import {useSearchParams} from "react-router-dom";
import {useNotificationContext} from "../hooks/useNotificationContext.jsx";
import {Button, Container, Form, Row, Table} from "react-bootstrap";
import {ADMIN_PRODUCT_PER_PAGE, API_URL, PRODUCT_API_URL, PRODUCT_IMAGE_PATH} from "../utils/Constant.jsx";
import CustomPagination from "../components/CustomPagination.jsx";
import ModalAddProduct from "../components/Admin/ModalBox/ModalAddProduct.jsx";
import ModalUpdateProduct from "../components/Admin/ModalBox/ModalUpdateProduct.jsx";
import ModalConfirmDelete from "../components/Admin/ModalBox/ModalConfirmDelete.jsx";


const initialState = {
    productList: [],
    currentPage: 1,
    totalPage: 0,
    isLastPage: false,
    isFirstPage: false,
    minPrice: "",
    maxPrice: "",
    searchBy: "name",
    search: "",
    optionList:{
        brands: [],
        providers: [],
    },
    selectedProduct: null,
    showAddModal: false,
    showUpdateModal: false,
    showDetailModal: false,
    skuList: [],
    showConfirmDelete: false,
};

const reducer = (state, action)  => {
    switch (action.type) {
        case 'SET_PRODUCT_LIST': return { ...state, productList: action.payload };
        case 'SET_CURRENT_PAGE': return { ...state, currentPage: action.payload };
        case 'SET_TOTAL_PAGE': return { ...state, totalPage: action.payload };
        case 'SET_IS_LAST_PAGE': return { ...state, isLastPage: action.payload };
        case 'SET_IS_FIRST_PAGE': return { ...state, isFirstPage: action.payload };
        case 'SET_MIN_PRICE': return { ...state, minPrice: action.payload };
        case 'SET_MAX_PRICE': return { ...state, maxPrice: action.payload };
        case 'SET_SEARCH_BY': return { ...state, searchBy: action.payload };
        case 'SET_SEARCH': return { ...state, search: action.payload };
        case 'SET_SHOW_ADD_MODAL': return { ...state, showAddModal: action.payload ?? !state.showAddModal };
        case 'SET_SHOW_UPDATE_MODAL': return { ...state, showUpdateModal: action.payload ?? !state.showUpdateModal };
        case 'SET_SELECTED_PRODUCT': return { ...state, selectedProduct: action.payload };
        case 'SET_OPTION_LIST': return { ...state, optionList: action.payload };
        case 'SET_SHOW_DETAIL_MODAL': return { ...state, showDetailModal: action.payload ?? !state.showDetailModal };
        case 'SET_SKU_LIST': return { ...state, skuList: action.payload };
        case 'SET_SHOW_CONFIRM_DELETE': return { ...state, showConfirmDelete: action.payload };
        default: return state;
    }
};

export default function AdminProduct() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [searchParams, setSearchParams] = useSearchParams();
    const { showNotification } = useNotificationContext();

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const fetchAllData = async () => {
            try {
                // Đặt limit cho searchParams
                searchParams.set('limit', `${ADMIN_PRODUCT_PER_PAGE}`);
                const urlProducts = `${PRODUCT_API_URL}?${searchParams.toString()}`;

                // Gọi 3 API song song
                const [brandsRes, providersRes, productsRes] = await Promise.all([
                    fetch(`${API_URL}brand`, {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                        signal
                    }),
                    fetch(`${API_URL}provider`, {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                        signal
                    }),
                    fetch(urlProducts, { signal })
                ]);

                // Kiểm tra lỗi
                if (!brandsRes.ok || !providersRes.ok || !productsRes.ok) {
                    throw new Error('Failed to fetch brands, providers, or products');
                }

                // Parse JSON song song
                const [brandsData, providersData, productsData] = await Promise.all([
                    brandsRes.json(),
                    providersRes.json(),
                    productsRes.json()
                ]);

                // Dispatch brands & providers
                dispatch({
                    type: 'SET_OPTION_LIST',
                    payload: {
                        brands: brandsData.brands,
                        providers: providersData.providers
                    }
                });

                // Dispatch products
                dispatch({ type: 'SET_PRODUCT_LIST', payload: productsData.products });
                dispatch({ type: 'SET_TOTAL_PAGE', payload: productsData.totalPage });
                dispatch({ type: 'SET_CURRENT_PAGE', payload: productsData.currentPage });

            } catch (error) {
                if (error.name === 'AbortError') {
                    console.log('Fetch aborted');
                } else {
                    console.error(error);
                }
            }
        };

        fetchAllData();

        return () => {
            controller.abort();
        };
    }, [searchParams]);

    return (
        <Container fluid className={"w-100 vh-100 rounded-3"}
                   style={{background: "linear-gradient(to right, rgb(246, 247, 244), rgb(237, 243, 230), rgb(234, 245, 234), rgb(227, 245, 227))"}}
        >
            <Row className={"h-15 align-content-center"}>
                <Form className="d-flex flex-wrap gap-2">
                    <Form.Group controlId="selectsearchBy">
                        <Form.Select
                            onChange={(e) => {
                                dispatch({type: 'SET_SEARCH_BY', payload: e.target.value})
                                dispatch({type: 'SET_SEARCH', payload: ""})
                            }}
                            defaultValue={state.searchBy}
                        >
                            <option value="name">Tên sản phẩm</option>
                            <option value="product_id">ID sản phẩm</option>
                            <option value="brand_id">Hãng</option>
                            <option value="status">Trạng thái</option>
                            <option value="provider_id">Nhà cung cấp</option>
                        </Form.Select>
                    </Form.Group>

                    {(state.searchBy === "name" || state.searchBy === "product_id") && (
                        <Form.Group controlId="searchKeyword">
                            <Form.Control
                                type="text"
                                placeholder="Nhập từ khóa..."
                                onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
                                value={state.search}
                            />
                        </Form.Group>
                    )}

                    {state.searchBy === "brand_id" && (
                        <Form.Group controlId="searchKeyword">
                            <Form.Select
                                onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
                                defaultValue={state.search}
                            >
                                <option value={""}>--Chọn--</option>
                                {state.optionList.brands.map((item) => (
                                    <option key={item.brand_id} value={item.brand_id}>{item.brand_name}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    )}

                    {state.searchBy === "status" && (
                        <Form.Group controlId="searchKeyword">
                            <Form.Select
                                onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
                                defaultValue={state.search}
                            >
                                <option value={""}>--Chọn--</option>
                                <option value={"true"}>Đang kinh doanh</option>
                                <option value={"false"}>Ngừng kinh doanh</option>
                            </Form.Select>
                        </Form.Group>
                    )}

                    {state.searchBy === "provider_id" && (
                        <Form.Group controlId="searchKeyword">
                            <Form.Select
                                onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
                                defaultValue={state.search}
                            >
                                <option value={""}>--Chọn--</option>
                                {state.optionList.providers.map((item) => (
                                    <option key={item.provider_id} value={item.provider_id}>{item.provider_name}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    )}

                    <Form.Group controlId="minPrice" style={{width:'150px'}}>
                        <Form.Control
                            type="text"
                            placeholder="Giá từ"
                            value={state.minPrice ? state.minPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ""}
                            onChange={(e) => {
                                const rawValue = e.target.value.replace(/\./g, '');
                                if (!isNaN(Number(rawValue))) {
                                    dispatch({ type: 'SET_MIN_PRICE', payload: rawValue });
                                }
                            }}
                        />
                    </Form.Group>

                    <Form.Group controlId="maxPrice" style={{width:'150px'}}>
                        <Form.Control
                            type="text"
                            placeholder="Đến"
                            value={state.maxPrice ? state.maxPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ""}
                            onChange={(e) => {
                                const rawValue = e.target.value.replace(/\./g, '');
                                if (!isNaN(Number(rawValue))) {
                                    dispatch({ type: 'SET_MAX_PRICE', payload: rawValue });
                                }
                            }}
                        />
                    </Form.Group>

                    <Form.Group controlId="sortButtons" className="d-flex gap-2">
                        <Button className={"btn-primary"}
                                onClick={() => {
                                    const newParams = new URLSearchParams(searchParams.toString());
                                    newParams.forEach((_, key) => newParams.delete(key));

                                    const min = parseInt(state.minPrice || "0");
                                    const max = parseInt(state.maxPrice || "0");

                                    if (state.minPrice && state.maxPrice && max < min) {
                                        showNotification('Giá tối thiểu phải nhỏ hơn giá tối đa');
                                        return;
                                    }

                                    if (state.minPrice && state.maxPrice) {
                                        newParams.set('min_price', state.minPrice);
                                        newParams.set('max_price', state.maxPrice);
                                    } else {
                                        newParams.delete('min_price');
                                        newParams.delete('max_price');
                                    }

                                    if (state.search) {
                                        newParams.set("searchBy", state.searchBy);
                                        newParams.set("search", state.search);
                                    } else {
                                        newParams.delete("searchBy");
                                        newParams.delete("search");
                                    }

                                    setSearchParams(newParams);
                                }}
                        >
                            Áp dụng
                        </Button>
                    </Form.Group>

                    <Form.Group controlId="sortButtons" className="d-flex gap-2">
                        <Button
                            variant="outline-primary"
                            onClick={() => {
                                setSearchParams(prev => {
                                    prev.delete('page');
                                    prev.set("sort", "base_price");
                                    prev.set("sort_dir", "ASC");
                                    return prev;
                                });
                            }}
                        >
                            Giá tăng
                        </Button>
                        <Button
                            variant="outline-primary"
                            onClick={() => {
                                setSearchParams(prev => {
                                    prev.delete('page')
                                    prev.set("sort", "base_price");
                                    prev.set("sort_dir", "DESC");
                                    return prev;
                                });
                            }}
                        >
                            Giá giảm
                        </Button>
                    </Form.Group>
                    <Form.Group controlId="sortButtons" className="d-flex gap-2">
                        <Button
                            variant="success"
                            onClick={() => dispatch({ type: 'SET_SHOW_ADD_MODAL', payload: true })}
                        >
                            + Thêm sản phẩm
                        </Button>
                    </Form.Group>
                </Form>
            </Row>
            <Row>
                <Table striped bordered hover className={"text-center mb-4"}
                       style={{verticalAlign: 'middle'}}
                >
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên sản phẩm</th>
                            <th>Hình ảnh</th>
                            <th>Giá cơ bản</th>
                            <th>Ngày ra mắt</th>
                            <th>Hãng</th>
                            <th>Nhà cung cấp</th>
                            <th>Trạng thái</th>
                            <th colSpan={2}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {state.productList && state.productList.map((product) => (
                        <tr key={product.product_id}>
                                <td>{product.product_id}</td>
                                <td>{product.name}</td>
                                <td>
                                    <img
                                        src={`${PRODUCT_IMAGE_PATH}${product.image}`}
                                        alt={product.name}
                                        style={{ width: '70px', height: '70px' }}
                                    />
                                </td>
                                <td>${product.base_price.toLocaleString('vi-VN')}</td>
                                <td>{new Date(product.release_date).toLocaleDateString('vi-VN')}</td>
                                <td>{product.brand_name}</td>
                                <td>{product.provider_name}</td>
                                <td>{product.status ? "Đang kinh doanh" : "Ngừng kinh doanh"}</td>
                                <td>
                                    <Button
                                        variant="warning"
                                        onClick={() => {
                                            dispatch({ type: 'SET_SELECTED_PRODUCT', payload: product });
                                            dispatch({ type: 'SET_SHOW_UPDATE_MODAL', payload: true });
                                        }}
                                    >
                                        Sửa
                                    </Button>
                                </td>
                                <td>
                                    <Button
                                        variant="danger"
                                        onClick={() => {
                                            dispatch({ type: 'SET_SELECTED_PRODUCT', payload: product });
                                            dispatch({ type: 'SET_SHOW_CONFIRM_DELETE', payload: true });
                                        }}
                                    >
                                        Xóa
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                {state.totalPage > 1 && (
                    <CustomPagination
                        currentPage={state.currentPage}
                        totalPage={state.totalPage}
                        searchParams={searchParams}
                        setSearchParams={setSearchParams}
                    />
                )}
            </Row>

            {state.showAddModal && (
                <ModalAddProduct
                    show={state.showAddModal}
                    handleClose={() => dispatch({ type: 'SET_SHOW_ADD_MODAL', payload: false })}
                    refreshList={() => setSearchParams({})}
                    optionList={state.optionList}
                />
            )}

            {state.showUpdateModal && state.selectedProduct && (
                <ModalUpdateProduct
                    show={state.showUpdateModal}
                    handleClose={() => dispatch({ type: 'SET_SHOW_UPDATE_MODAL', payload: false })}
                    selectedProduct={state.selectedProduct}
                    refreshList={() => setSearchParams({})}
                    optionList={state.optionList}
                />
            )}

            {state.showConfirmDelete && state.selectedProduct && (
                <ModalConfirmDelete
                    show={state.showConfirmDelete}
                    handleClose={() => dispatch({ type: 'SET_SHOW_CONFIRM_DELETE', payload: false })}
                    refreshList={() => setSearchParams({})}
                    productId={state.selectedProduct.product_id}
                    title="Xác nhận xóa sản phẩm"
                    body={`Bạn có chắc chắn muốn xóa sản phẩm "${state.selectedProduct.name}" không?`}
                />
            )}
        </Container>
    )
}
