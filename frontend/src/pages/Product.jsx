import {useEffect, useState} from "react";
import { useLocation } from 'react-router-dom';
import Card from "../components/Card.jsx";
import '../styles/Product.css'

export const Product = () => {
    const [products, setProducts] = useState([])
    const location = useLocation();
    let url = `http://localhost/api/product${location.search}`;
    useEffect( () => {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                return response.json();
            })
            .then(data => {
                setProducts(data);
            })
            .catch(error => {
                console.error('Error fetching products:', error.message);
            });
        console.log(products)
    }, [location.search, products, url]);
    return (
        <>
            {products.length === 0 ? (
                <h1 className="text-center mt-4 mb-4">No products found</h1>
            ) : (
                <>
                    <h1 className="text-center mt-4 mb-4">Products</h1>
                    <div className={'container d-flex flex-wrap justify-content-center'}>
                        {products.map((product) => (
                            <Card key={product.product_id} phone={product}/>
                        ))}
                    </div>
                </>
            )}
        </>
    )
}