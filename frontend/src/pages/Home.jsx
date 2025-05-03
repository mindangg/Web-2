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

const Home = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const fetchProducts = async () => {
            try {
                const response = await fetch(`${PRODUCT_API_URL}?limit=10`, { signal });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setProducts(data.products);
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

    // Slider settings
    const sliderSettings = {
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

    return (
        <div className='w-100'>
            <IntroduceVideo/>
            <div className="w-100 my-5">
                <Row>
                    <Col>
                        {products.length > 0 ? (
                            <Slider {...sliderSettings}>
                                {products.map((product) => (
                                    <div key={product.product_id} className="p-2">
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
            </div>
        </div>
    )
}

export default Home