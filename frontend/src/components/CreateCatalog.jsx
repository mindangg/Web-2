import React from 'react'

import '../styles/CreateCatalog.css'
import '../styles/Admin.css'

export default function CreateProduct(){
    return(
        <>
        <div className='page'>
        <div className ='title'>Tạo danh mục</div>
        <div className ='title'>Trang chủ /Tạo danh mục</div>
        <div className ='container-content'>
            <div>
            <div className ='list'>Tên danh mục</div>
            <input className ='content'/>
            </div>

        </div>
        <button>Tạo</button>


        </div>

        </>
    )
}