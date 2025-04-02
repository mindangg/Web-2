import React from "react";
import "../styles/Cart/Payment.css"
import PaymentInfoUser from "../components/Cart/PaymentInfoUser";
import { Link } from "react-router-dom";
import PaymentInfoProduct from "../components/Cart/PaymentInfoProduct";
function Payment(){
    return(
        <>
            <h2 id="h2">Giỏ hàng</h2>
            <div className="payment">
                <PaymentInfoUser/>
                <PaymentInfoProduct/>
                <Link to='/checkout'>
                    <button id="complete-btn">HOÀN TẤT ĐẶT HÀNG</button>
                </Link>
            </div>
        </>
    );
}export default Payment