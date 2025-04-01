import ip12 from 'C:/xampp/htdocs/Projects/Web-2/frontend/src/assets/iphone-12-pro-blue-hero.png';
import "../../styles/Cart/PaymentInfoProduct.css"
function PaymentInfoProduct(){
    return(
        <div className='info-product'>
            <h5>Sản phẩm</h5>
            <table >
                <thead>
                    <tr>
                        <th></th>
                        <th>Tên sản phẩm</th>
                        <th>Số lượng</th>
                        <th>Giá</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td >
                            <img src={ip12} alt="iPhone 12 Pro Max"/>
                        </td>
                        <td>
                            iPhone 12 Pro Max (256GB) | Chính hãng VN/A - Xanh Dương
                        </td>
                        <td>
                            1
                        </td>
                        <td>12.000.000 đ</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                    <td colSpan="3"><b>Tổng cộng</b></td>
                    <td className="total-amount">
                        320000
                    </td>
                    </tr>
                </tfoot>
            </table>
            <button><i className="fa-solid fa-reply"></i>Sửa đổi</button>
        </div>
    );
} export default PaymentInfoProduct