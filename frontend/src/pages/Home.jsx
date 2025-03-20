import React, { useState } from 'react'

import '../styles/Home.css'

import Display from '../components/Display'
import Pagination from '../components/Pagination'
import Slider from '../components/Slider'

import banner from '../assets/banner.png'

export default function Home() {
    const [phone, setPhone] = useState([])
    const [currentPage, setCurrentPage] = useState(1) 
    const [productPerPages, setproductPerPages] = useState(8) 

    const lastPageIndex = currentPage * productPerPages
    const firstPageIndex = lastPageIndex - productPerPages
    // const currentPhone = phone.slice(firstPageIndex, lastPageIndex)

    return (
        <div className='home'>   
            {/* <div className='banner'>
                <img src={banner}></img>
            </div> */}
            <Slider/>
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
