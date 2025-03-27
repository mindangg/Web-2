import {useEffect, useState} from "react";
import {useSearchParams} from 'react-router-dom';
import Card from "../components/product/Card.jsx";
import Pagination from "../components/Pagination.jsx";
import '../styles/Product.css'
import {Filter} from "../components/product/Filter.jsx";

const PRODUCT_PER_PAGE = 10;

export const Product = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [products, setProducts] = useState([])
    const [searchParams, setSearchParams] = useSearchParams(`limit=${PRODUCT_PER_PAGE}`);

    let url = `http://localhost/api/product?${searchParams.toString()}`;

    useEffect( () => {
        
        const controller = new AbortController();
        const signal = controller.signal;
        const fetchData = async () => {
            try {
                const response = await fetch(url, { signal });
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
                <div className={'container'}>
                    <h1 className="text-center mt-4 mb-4">No products found</h1>
                </div>
            ) : (
                <>
                    <h1 className="text-center mt-4 mb-4">Products</h1>
                    <div className={'container'}>
                        <Filter />
                        {products.map((product) => (
                            <Card key={product.product_id}
                                  phone={product}
                                  onClick={() => {
                                  }}
                            />
                        ))}
                        {totalPage > 1 && (
                            <Pagination
                                totalPage={totalPage}
                                currentPage={currentPage}
                            />
                        )}
                    </div>
                </>
            )}
        </>
    )
}