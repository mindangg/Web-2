import '../../styles/Card.css'
import {Card} from "react-bootstrap";
import {PRODUCT_IMAGE_PATH} from "../../utils/Constant.jsx";

const ProductCard = ({ product, onClick }) => {
    return (
        <Card
            key={product.product_id}
            className="custom-card"
            onClick={() => onClick(product.product_id)}
        >
            <Card.Img className={"w-100 h-75"}
                      style={{ minWidth: '150px', minHeight: '200px', maxHeight: '200px', maxWidth: '200px' }}
                      variant="top" src={`${PRODUCT_IMAGE_PATH}${product.image}`} />
            <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text className="text-danger fw-bold fs-5">
                    {product.base_price !== undefined && product.base_price !== null
                        ? `${product.base_price.toLocaleString('de-DE')}đ`
                        : 'N/A'}
                </Card.Text>
            </Card.Body>
        </Card>
    );
};

export default ProductCard;
