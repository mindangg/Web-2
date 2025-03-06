import React from 'react'

import '../styles/CreateProduct.css'
import '../styles/Admin.css'

export default function CreateProduct(){
    return(
        <>
        <div className='page'>
        <div className ='title'>Tạo sản phẩm</div>
        <div className ='title'>Trang chủ /Tạo sản phẩm</div>
        <button>Về danh sách</button>
        <div className ='container-content'>
            <div>
                <div className ='list'>Tên</div>
                <input className ='content'/>
                <div className ='list'>Giá</div>
                <input className ='content'></input>
                <div className ='list'>Danh mục</div>
                <label for='option'></label>
                <select id='option'> 
                    <option value='' selected disabled>[--Chọn danh mục--]</option>
                    <option value='iPhone'>iPhone</option>
                    <option value='Samsung'>Samsung</option>
                    <option value='Oppo'>Oppo</option>
                    <option value='Huawei'>Huawei</option>
                    <option value='Realme'>Realme</option>
                    <option value='Vivo'>Vivo</option>
                    <option value='Xiaomi'>Xiaomi</option>

                </select>
                <div className ='list'>Số lượng</div>
                <input className ='content'/>
            </div>
                <div className ='box'>
                <div className ='list'>Mô tả ngắn gọn</div>
                <textarea className ='content' rows ='4'/>
                <div className ='list'>Mô tả chi tiết</div>
                <textarea className ='content' rows ='4'/>
                </div>
                <div className ='box'>
                <div className ='list'>Hình ảnh sản phẩm</div>
                <input type='file'></input>
                <div className ='list'>Hình ảnh đại diện</div>
                <input type='file'></input>
                </div>
            </div>

        <button>Tạo</button>
        </div>
        </>
    )
}