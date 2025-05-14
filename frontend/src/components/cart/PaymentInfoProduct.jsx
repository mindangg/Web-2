// import ip12 from 'C:/xampp/htdocs/Projects/Web-2/frontend/src/assets/iphone-12-pro-blue-hero.png';
import { useState, useEffect } from "react";
 import { useCartContext } from "../../hooks/useCartContext"
import "../../styles/Cart/PaymentInfoProduct.css"
import { Link } from "react-router-dom";
function PaymentInfoProduct() {
    const { cart } = useCartContext();
    const totalAmount = cart.reduce((sum, item) => sum + (item.invoice_price * item.quantity), 0);

    useEffect(() => {
        console.log("Các mục trong giỏ hàng:", cart);
        const skuIds = cart.map(item => item.sku_id);
        const uniqueSkuIds = new Set(skuIds);
        if (skuIds.length !== uniqueSkuIds.size) {
            console.warn("Phát hiện sku_id trùng lặp trong giỏ hàng:", skuIds);
        }
    }, [cart]);

    return (
        <div className="info-product">
            <h5>Sản phẩm</h5>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Tên sản phẩm</th>
                        <th>Số lượng</th>
                        <th>Giá</th>
                    </tr>
                </thead>
                <tbody>
                    {cart.map((item) => (<tr key={item.sku_id}><td><img src={`./product/${item.image}`} alt={item.name}/></td><td>{item.sku_name}</td><td>{item.quantity}</td><td>{item.invoice_price.toLocaleString('vi-VN')}đ</td></tr>))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan="3"><b>Tổng cộng</b></td>
                        <td className="total-amount">
                            {totalAmount.toLocaleString('vi-VN')}đ
                        </td>
                    </tr>
                </tfoot>
            </table>
            <Link to="/cart"><button><i className="fa-solid fa-reply"></i>Sửa đổi</button></Link>
        </div>
    );
}

export default PaymentInfoProduct;