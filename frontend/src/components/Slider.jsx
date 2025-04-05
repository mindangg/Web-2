import React, { useEffect, useRef, useState } from 'react';

import banner1 from '../assets/banner.png';
import banner2 from '../assets/banner.png';
import banner3 from '../assets/banner.png';
import banner4 from '../assets/banner.png';
import banner5 from '../assets/banner.png';

export default function Slider() {
    const listRef = useRef(null);
    const itemsRef = useRef([]);
    const dotsRef = useRef([]);
    const nextRef = useRef(null);
    const prevRef = useRef(null);

    const [active, setActive] = useState(0);
    const lengthItems = 4;

    useEffect(() => {
        if (!listRef.current || !nextRef.current || !prevRef.current) return;

        const next = nextRef.current;
        const prev = prevRef.current;

        const refreshSlider = setInterval(() => {
            handleNext();
        }, 5000);

        function handleNext() {
            setActive((prevActive) => (prevActive + 1 > lengthItems ? 0 : prevActive + 1));
        }

        function handlePrev() {
            setActive((prevActive) => (prevActive - 1 < 0 ? lengthItems : prevActive - 1));
        }

        next.addEventListener("click", handleNext);
        prev.addEventListener("click", handlePrev);

        return () => {
            clearInterval(refreshSlider);
            next.removeEventListener("click", handleNext);
            prev.removeEventListener("click", handlePrev);
        };
    }, []);

    useEffect(() => {
        if (!listRef.current || !itemsRef.current[active] || !dotsRef.current[active]) return;

        const checkLeft = itemsRef.current[active].offsetLeft;
        listRef.current.style.left = `-${checkLeft}px`;

        document.querySelector('.slider .slider-dots li.active')?.classList.remove('active');
        dotsRef.current[active].classList.add('active');
    }, [active]);

    return (
        <div className='slider'>
            <div className='slider-list' ref={listRef}>
                {[banner1, banner2, banner3, banner4, banner5].map((banner, index) => (
                    <div className='slider-item' key={index} ref={(el) => (itemsRef.current[index] = el)}>
                        <img src={banner} alt={`Banner ${index + 1}`} />
                    </div>
                ))}
            </div>

            <div className='slider-button'>
                <button id='slider-prev' ref={prevRef}>{'<'}</button>
                <button id='slider-next' ref={nextRef}>{'>'}</button>
            </div>

            <ul className='slider-dots'>
                {[...Array(5)].map((_, index) => (
                    <li
                        key={index}
                        ref={(el) => (dotsRef.current[index] = el)}
                        className={index === 0 ? 'active' : ''}
                        onClick={() => setActive(index)}
                    ></li>
                ))}
            </ul>
        </div>
    );
}
