import '../styles/Home.css'

import Display from '../components/Display'
import Pagination from '../components/Pagination'
import Slider from '../components/Slider'

import banner from '../assets/banner.png'

export default function Home() {

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
