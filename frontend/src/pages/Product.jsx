import React, { useState } from 'react'
import Display from '../components/Display'
import Pagination from '../components/Pagination'

export default function Product() {
    const [phone, setPhone] = useState([])
    const [currentPage, setCurrentPage] = useState(1) 
    const [productPerPages, setproductPerPages] = useState(8) 

    const lastPageIndex = currentPage * productPerPages
    const firstPageIndex = lastPageIndex - productPerPages
    // const currentPhone = phone.slice(firstPageIndex, lastPageIndex)

    return (
        <div className='product'>   
            <Display/>
            <Pagination
                totalProducts={phone.length} 
                productPerPages={productPerPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
        </div>
    )
}
