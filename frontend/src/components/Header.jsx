import React, { useState, useRef, useEffect } from 'react'

import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import logo from '../assets/logo.png'

import {
    Form,
    Button,
    Overlay,
    Popover,
    InputGroup,
    Row,
    Col
} from 'react-bootstrap';

import '../styles/Header.css'

import { useAuthContext } from '../hooks/useAuthContext'
import { useLogout } from '../hooks/useLogout'
import { useNotificationContext } from '../hooks/useNotificationContext'
import {API_URL} from "../utils/Constant.jsx";

export default function Header() {
    const { user } = useAuthContext()
    const { logout } = useLogout()
    const [brands, setBrands] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const { showNotification } = useNotificationContext()
    const navigate = useNavigate()
    const [showFilter, setShowFilter] = useState(false);
    const [brand, setBrand] = useState('');
    const [priceFrom, setPriceFrom] = useState('');
    const [priceTo, setPriceTo] = useState('');

    const searchRef = useRef(null);
    const filterRef = useRef(null);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        const fetchBrands = async () => {
            try {
                const response = await fetch(`${API_URL}brand`, { signal });
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                setBrands(data.brands);
            } catch (error) {
                if (error.name === 'AbortError') {
                    console.log('Fetch aborted');
                } else {
                    console.error(error);
                }
            }
        };
        fetchBrands()
        return () => {
            controller.abort();
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                filterRef.current &&
                !filterRef.current.contains(e.target) &&
                searchRef.current &&
                !searchRef.current.contains(e.target)
            ) {
                setShowFilter(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const [toggle, setToggle] = useState('home')

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            searchParams.set('search', searchQuery.trim());
            if (brand) {
                searchParams.set('brand', brand);
            }
            if (priceFrom) {
                searchParams.set('minPrice', priceFrom);
            }
            if (priceTo) {
                searchParams.set('maxPrice', priceTo);
            }
            if (priceTo < priceFrom) {
                showNotification('Giá tối đa không được nhỏ hơn giá tối thiểu');
                return;
            }
            navigate(`/product?${searchParams.toString()}`);
        }
        setBrand('')
        setPriceTo('')
        setPriceFrom('');
        setShowFilter(false);
    };

    return (
        <header>
            <div className='header'>
                <Link to={'/'}>
                    <img src={logo} alt='logo'></img>
                </Link>
                <div className="position-relative search">
                    <button onClick={() => setShowFilter(!showFilter)}>
                        <i className="fa-solid fa-filter"></i>
                    </button>
                    <input
                        className={'search-field'}
                        placeholder="Nhập thứ cần tìm..."
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit(e)}
                    />
                    <button type="submit" onClick={handleSearchSubmit}>
                        <i className="fas fa-search"></i>
                    </button>

                    {showFilter && (
                        <div
                            ref={filterRef}
                            className="bg-light border rounded p-3 shadow-sm"
                            style={{
                                position: 'absolute',
                                top: '80%',
                                width: '100%',
                                zIndex: 1000
                            }}
                        >
                            <Form.Group className="mb-3">
                                <Form.Label>Hãng sản xuất</Form.Label>
                                <Form.Select value={brand} onChange={(e) => setBrand(e.target.value)}>
                                    <option value="">---</option>
                                    {brands.map((brand, index) => (
                                        <option key={index} value={brand.id}>
                                            {brand.brand_name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Label>Khoảng giá (VNĐ)</Form.Label>
                            <Row>
                                <Col>
                                    <Form.Control
                                        type="number"
                                        placeholder="Từ"
                                        value={priceFrom}
                                        onChange={(e) => setPriceFrom(e.target.value)}
                                    />
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="number"
                                        placeholder="Đến"
                                        value={priceTo}
                                        onChange={(e) => setPriceTo(e.target.value)}
                                    />
                                </Col>
                            </Row>
                        </div>
                    )}
                </div>

                <div className='action'>
                    <i className="fa-solid fa-user"></i>
                    {!user ? <Link to='/login'>Đăng nhập</Link> : <Link onClick={logout}>Đăng xuất</Link>}
                    <i className="fa-solid fa-basket-shopping"></i>
                    {user ? (
                    <Link to="/cart">Giỏ hàng</Link>
                    ) : (
                    <Link onClick={() => showNotification('Vui lòng đăng nhập để xem giỏ hàng')}>Giỏ hàng</Link>
                    )}
                </div>
            </div>

            <div className='nav-container'>
                <nav className='nav'>
                    <Link to='/' onClick={() => setToggle('home')}
                          className={toggle === 'home' ? 'active' : ''}>HOME</Link>
                    <Link to={'/product'} onClick={() => setToggle('product')}
                          className={toggle === 'product' ? 'active' : ''}>PRODUCT</Link>
                    <Link to={'/product?brand=apple'} onClick={() => setToggle('apple')}
                          className={toggle === 'apple' ? 'active' : ''}>IPHONE</Link>
                    <Link to={'/product?brand=samsung'} onClick={() => setToggle('samsung')}
                          className={toggle === 'samsung' ? 'active' : ''}>SAMSUNG</Link>
                    <Link to={'/product?brand=oppo'} onClick={() => setToggle('oppo')}
                          className={toggle === 'oppo' ? 'active' : ''}>OPPO</Link>
                    <Link to={'/product?brand=huawei'} onClick={() => setToggle('huawei')}
                          className={toggle === 'huawei' ? 'active' : ''}>HUAWEI</Link>
                    <Link to={'/product?brand=realme'} onClick={() => setToggle('realme')}
                          className={toggle === 'realme' ? 'active' : ''}>REALME</Link>
                    <Link to={'/product?brand=vivo'} onClick={() => setToggle('vivo')}
                          className={toggle === 'vivo' ? 'active' : ''}>VIVO</Link>
                    <Link to={'/product?brand=xiaomi'} onClick={() => setToggle('xiaomi')}
                          className={toggle === 'xiaomi' ? 'active' : ''}>XIAOMI</Link>
                </nav>
            </div>
        </header>
    )
}
