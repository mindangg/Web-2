import '../../styles/Card.css'

import { useAddToCart } from '../../hooks/useAddToCart'
import { useAuthContext } from '../../hooks/useAuthContext'
import {useNavigate} from "react-router-dom";

export default function Card({ phone }) {
    const { addToCart } = useAddToCart()
    const navigator = useNavigate();
    return (
        <div className='card'>
            <div className='card-img'>
                <img src={`./product/${phone.image}`}/>
            </div>
            <div className='card-body'>
                <h5>{phone.name}</h5>
                <p>${phone.base_price}</p>
                <div className='card-btns'>
                    <button
                        onClick={() => {
                            navigator(`/product/${phone.product_id}`)
                        }}
                    ><i className="fa-solid fa-magnifying-glass-plus"></i></button>
                    <button onClick={() => addToCart()}>Thêm vào<i className="fa-solid fa-cart-shopping"></i></button>
                </div>
            </div>
        </div>
    )
}
