import '../styles/Home.css'
import IntroduceVideo from "../components/IntroduceVideo.jsx";
import {Col, Row} from "react-bootstrap";
import {useEffect, useState} from "react";
import {PRODUCT_API_URL} from "../utils/Constant.jsx";
import {useNavigate} from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductCard from "../components/Admin/ProductCard.jsx";
import pic1 from '../assets/slider/xiaomi-15-ultra-home-1tb.webp'
import pic2 from '../assets/slider/dien-thoai-samsung-galaxy-s25-ultra-banner-home.webp'
import pic3 from '../assets/slider/iphone-16-pro-max-thu-cu-moi-home.webp'
import pic4 from '../assets/slider/oppo-find-n5-home-mu-ngay-14-4.webp'
import pic5 from '../assets/slider/vivo-v50-home.webp'

const Home = () => {
    const [products, setProducts] = useState([]);
    const [products2, setProducts2] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const fetchProducts = async () => {
            try {
                const response = await fetch(`${PRODUCT_API_URL}?limit=10&status=true`, { signal });
                const response2 = await fetch(`${PRODUCT_API_URL}?limit=8&status=true&sort=base_price&sort_dir=DESC`, { signal });
                if (!response.ok || !response2.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                const data2 = await response2.json();
                setProducts(data.products);
                setProducts2(data2.products);
            } catch (error) {
                if (error.name === 'AbortError') {
                    console.log('Fetch aborted');
                } else {
                    console.error('Error fetching products:', error);
                }
            }
        }
        fetchProducts();
        return () => {
            controller.abort();
        }
    }, []);

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    const productSliderSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        initialSlide: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 1000,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 800,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            }
        ]
    };

    const picList = [
        pic1,
        pic2,
        pic3,
        pic4,
        pic5
    ];

    // Picture slider settings
    const picSliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        arrows: true,
    }

    return (
        <div className='w-100'>
            <IntroduceVideo/>

            <div className="w-100">
                <Row>
                    <Col className='product-slider'>
                        {products.length > 0 ? (
                            <Slider {...productSliderSettings}>
                                {products.map((product) => (
                                    <div key={product.product_id} className="slider-item">
                                        <ProductCard
                                            product={product}
                                            onClick={() => handleProductClick(product.product_id)}
                                        />
                                    </div>
                                ))}
                            </Slider>
                        ) : (
                            <div className="text-center py-5">Đang tải sản phẩm...</div>
                        )}
                    </Col>
                </Row>
                <Row>
                    <Col className="picture-slider">
                        <Slider {...picSliderSettings}>
                            {picList.map((pic, index) => (
                                <div key={index}>
                                    <img src={pic} alt={`Slide ${index + 1}`} />
                                </div>
                            ))}
                        </Slider>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div className={'container product'}>
                            {products2.map((product) => (
                                <ProductCard product={product}
                                             key={product.product_id}
                                                onClick={() => handleProductClick(product.product_id)}
                                />
                            ))}
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default Home