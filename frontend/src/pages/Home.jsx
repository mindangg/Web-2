import React, { useEffect } from 'react'

import '../styles/Home.css'

import Display from '../components/Display'
import Pagination from '../components/Pagination'
import Slider from '../components/Slider'

import banner from '../assets/banner.png'

import { useNotificationContext } from '../hooks/useNotificationContext'

export default function Home() {
    // const { showNotification } = useNotificationContext()
    // useEffect(() => {
    //     showNotification('Hello')
    // })

    return (
        <div className='home'>   
            {/* <div className='banner'>
                <img src={banner}></img>
            </div> */}
            {/* <Slider/>
            <Display/>
            <Pagination
                totalProducts={phone.length} 
                productPerPages={productPerPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            /> */}
        </div>
    )
}
