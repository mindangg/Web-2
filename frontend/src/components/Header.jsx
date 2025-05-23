import { useState, useEffect } from 'react'

import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import logo from '../assets/logo.png'

import {
    Form,
    Row,
    Col
} from 'react-bootstrap';

import '../styles/Header.css'

import { useAuthContext } from '../hooks/useAuthContext'
import { useLogout } from '../hooks/useLogout'
import { useNotificationContext } from '../hooks/useNotificationContext'
import useHeaderContext from "../hooks/useHeaderContext.jsx";

export default function Header() {
    const {brands} = useHeaderContext()
    const { user } = useAuthContext()
    const { logout } = useLogout()
    const [searchQuery, setSearchQuery] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const { showNotification } = useNotificationContext()
    const navigate = useNavigate()
    const [showFilter, setShowFilter] = useState(false);
    const [brand, setBrand] = useState('');
    const [priceFrom, setPriceFrom] = useState('');
    const [priceTo, setPriceTo] = useState('');

    const [toggle, setToggle] = useState('home')

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (parseInt(priceTo) < parseInt(priceFrom)) {
            showNotification('Giá tối đa không được nhỏ hơn giá tối thiểu');
            return;
        }
        searchParams.set('searchBy', 'name');
        searchParams.set('search', searchQuery.trim());
        if (brand) {
            searchParams.set('brand', brand);
        }
        if (priceFrom) {
            searchParams.set('min_price', priceFrom);
        }
        if (priceTo) {
            searchParams.set('max_price', priceTo);
        }
        navigate(`/product?${searchParams.toString()}`);
        setShowFilter(false);
    };

    return (
        <header>
            <div className='header'>
                <Link to={'/'}>
                    <img src={logo} alt='logo'></img>
                </Link>
                <div className='position-relative search'>
                    <button onClick={() => setShowFilter(!showFilter)}>
                        <i className='fa-solid fa-filter'></i>
                    </button>
                    <input
                        className={'search-field'}
                        placeholder='Nhập thứ cần tìm...'
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit(e)}
                    />
                    <button type='submit' onClick={handleSearchSubmit}>
                        <i className='fas fa-search'></i>
                    </button>

                    {showFilter && (
                        <div
                            // ref={filterRef}
                            className='bg-light border rounded p-3 shadow-sm'
                            style={{
                                position: 'absolute',
                                top: '80%',
                                width: '100%',
                                zIndex: 1000
                            }}
                        >
                            <Form.Group className='mb-3'>
                                <Form.Label>Hãng</Form.Label>
                                <Form.Select value={brand} onChange={(e) => setBrand(e.target.value)}>
                                    <option value=''>---</option>
                                    {brands.map((brand, index) => (
                                        <option key={index} value={brand.id}>
                                            {brand.brand_name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Label>Khoảng giá</Form.Label>
                            <Row>
                                <Col>
                                    <input
                                        className={'header-price-input'}
                                        type='text'
                                        placeholder='Từ'
                                        value={priceFrom ? priceFrom.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : ''}
                                        onChange={(e) => {
                                            const rawValue = e.target.value.replace(/\./g, '');
                                            if (!isNaN(Number(rawValue))) {
                                                setPriceFrom(rawValue);
                                            }
                                        }}
                                    />
                                </Col>
                                <Col>
                                    <input
                                        className={'header-price-input'}
                                        type='text'
                                        placeholder='Đến'
                                        value={priceTo ? priceTo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : ''}
                                        onChange={(e) => {
                                            const rawValue = e.target.value.replace(/\./g, '');
                                            if (!isNaN(Number(rawValue))) {
                                                setPriceTo(rawValue);
                                            }
                                        }}
                                    />
                                </Col>
                            </Row>
                        </div>
                    )}
                </div>

                <div className='action'>
                    {!user 
                    ? (
                        <>
                            <i className='fa-solid fa-user'></i>
                            <Link to='/login'>Đăng nhập</Link> 
                        </>
                    )
                    : (
                        <div className='user-dropdown'>
                            <i className='fa-solid fa-user'></i>
                            <Link className='dropdown-toggle'>
                            {user.user && user.user.username}
                            </Link>
                            
                            <div className='dropdown-menu'>
                                <Link onClick={logout} id='logout-btn'>Đăng xuất</Link>
                            </div>
                        </div>
                    )}

                    {user ? (
                    <>
                        <i onClick={() => navigate('/cart')} className='fa-solid fa-basket-shopping'></i>
                        <Link className='header-cart' to='/cart'>Giỏ hàng</Link>
                    </>

                    ) : (
                    <>
                        <i onClick={() => showNotification('Vui lòng đăng nhập để xem giỏ hàng')} className='fa-solid fa-basket-shopping'></i>
                        <Link className='header-cart' onClick={() => showNotification('Vui lòng đăng nhập để xem giỏ hàng')}>Giỏ hàng</Link>
                    </>
                    )}
                </div>
            </div>

            <div className='nav-container'>
                <nav className='nav'>
                    <Link to='/' onClick={() => setToggle('home')}
                          className={toggle === 'home' ? 'active' : ''}>TRANG CHỦ</Link>
                    <Link to={'/product'} onClick={() => setToggle('product')}
                          className={toggle === 'product' ? 'active' : ''}>SẢN PHẨM</Link>
                    {brands && brands.map((brand) => (
                    <Link to={`/product?brand=${brand.brand_name.toLowerCase()}`} key={brand.id} onClick={() => setToggle(brand.brand_name.toLowerCase())}
                              className={toggle === brand.brand_name.toLowerCase() ? 'active' : ''}>{brand.brand_name.toUpperCase()}</Link>
                    ))}
                </nav>
            </div>
        </header>
    )
}
