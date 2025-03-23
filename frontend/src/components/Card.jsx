import '../styles/Card.css'

export default function Card({phone}) {
        return (
            <div className='card'>
                <div className='card-img'>
                    <img src={`./product/${phone.image}`}/>
                </div>
                <div className='card-body'>
                    <h5>{phone.name}</h5>
                    <p>${phone.base_price}</p>
                    <div className='card-btns'>
                        <button><i className="fa-solid fa-magnifying-glass-plus"></i></button>
                        <button>Thêm vào <i className="fa-solid fa-cart-shopping"></i></button>
                    </div>
                </div>
            </div>
        )
}
