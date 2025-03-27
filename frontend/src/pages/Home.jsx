import '../styles/Home.css'


import banner from '../assets/banner.png'

export default function Home() {

    return (
        <div className='home'>   
            <div className='banner'>
                <img src={banner}></img>
            </div>
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
