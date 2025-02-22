import React from 'react'

import '../styles/CreateProduct.css'

export default function CreateProduct(){
    return(
        <>
        <div className='page'>
        <div className ='title'>Tạo sản phẩm</div>
        <div className ='title'>Trang chủ /Tạo sản phẩm</div>
        <button>Về danh sách</button>
        <div className ='container-content'>
        <div className ='list'>Tên</div>
        <div className ='content'></div>
        <div className ='list'>Giá</div>
        <div className ='content'></div>
        <div className ='list'>Danh mục</div>
        <label for='option'></label>
        <select id='option'> 
            <option value='' selected disabled>[--Chọn danh mục--]</option>
            <option value='1'>IPhone</option>
            <option value='2'>Samsung</option>
            <option value='3'>Xiaomi</option>
            <option value='4'>Oppo</option>
        </select>
        <div className ='list'>Số lượng</div>
        <div className ='content'></div>
        </div>
        <button>Tạo</button>


        </div>

        </>
    )
}