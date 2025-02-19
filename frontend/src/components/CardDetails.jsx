import React from 'react'

import ip12 from '../assets/iphone-12-pro-blue-hero.png'

import '../styles/CardDetails.css'

export default function CardDetails() {
    return (
        <div className='card-details-container'>
        <div className='card-details'>
            <div className='card-info'>
                <div>
                    <h4>iphone 12 128GB</h4>
                    <img src={ip12}></img>
                </div>
                <div>
                    <h3>30.990.000 đ</h3>
                    <p>Description Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae nihil ipsum nemo facere ut sapiente nesciunt esse mollitia repudiandae totam! Eos repellat fugit impedit? Hic vel voluptatibus eligendi quam rerum!</p>
                </div>
                <div>
                    <h3>Thông số kĩ thuật</h3>
                    <p>Màn hình:   1111111</p>
                    <p>Camera sau:</p>
                    <p>Camera Selfie:</p>
                    <p>RAM:</p>
                    <p>Bộ nhớ trong</p>
                    <p>CPU:</p>
                    <p>Dung lượng pin:</p>
                    <p>Thẻ sim:</p>
                    <p>Hệ điều hành:</p>
                </div>
            </div>

            <div className='card-controller'>
                <button id='buy-btn'>MUA NGAY</button>
                <h3>Đặc điểm nổi bật của iPhone 12</h3>
                <p>Thiết kế mỏng nhẹ, nhỏ gọn và đẳng cấp</p>
                <p>iPhone 12 đã có sự đột phá về thiết kế với kiểu dáng mới vuông vắn, mạnh mẽ và sang trọng hơn. Không chỉ vậy, <br/>
                    iPhone 12 mỏng hơn 11%, nhỏ gọn hơn 15% và nhẹ hơn 16% so với thế hệ trước iPhone 11</p>
                <button id='back-btn'><i className='fa-solid fa-reply'></i>Quay lại</button>
            </div>
        </div>
        </div>
    )
}
