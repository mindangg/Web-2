import {useEffect, useState} from "react";
import {useNavigate, useSearchParams} from 'react-router-dom';
import Pagination from "../components/CustomPagination.jsx";
import '../styles/Product.css'
import '../styles/Card.css'
import {Filter} from "../components/Product/Filter.jsx";
import Card from 'react-bootstrap/Card';
import {PRODUCT_API_URL, PRODUCT_IMAGE_PATH, PRODUCT_PER_PAGE} from "../utils/Constant.jsx";
import ProductCard from "../components/Admin/ProductCard.jsx";

export const Product = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [products, setProducts] = useState([])
    const [searchParams, setSearchParams] = useSearchParams(`limit=${PRODUCT_PER_PAGE}&status=true`);
    const navigator = useNavigate();

    useEffect( () => {
        const controller = new AbortController();
        const signal = controller.signal;
        const fetchData = async () => {
            try {
                const response = await fetch(`${PRODUCT_API_URL}?${searchParams.toString()}`, { signal });
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                setProducts(data.products);
                setTotalPage(data.totalPage);
                setCurrentPage(data.currentPage);
            } catch (error) {
                if (error.name === 'AbortError') {
                    console.log('Fetch aborted');
                } else {
                    console.error(error);
                }
            }
        };
        fetchData()
        return () => {
            controller.abort();
        };
    }, [searchParams]);

    return (
        <>
            {products.length === 0 ? (
                <div className={'container product'}>
                    <h1 className="text-center mt-4 mb-4">No products found</h1>
                </div>
            ) : (
                <>
                    <div className={'container product'}>
                        <Filter />
                        {products.map((product) => (
                            <ProductCard product={product}
                                         key={product.product_id}
                                         onClick={() => navigator(`/product/${product.product_id}`)}
                            />
                        ))}
                        {totalPage > 1 && (
                            <Pagination
                                totalPage={totalPage}
                                currentPage={currentPage}
                                searchParams={searchParams}
                                setSearchParams={setSearchParams}
                            />
                        )}
                    </div>
                </>
            )}
        </>
    )
}