import {useSearchParams} from "react-router-dom";
import '../../styles/Filter.css'
import ascSortLogo from '../../assets/ascending-sort.svg'
import descSortLogo from '../../assets/descending-sort.svg'
import {useState} from "react";
import {useNotificationContext} from "../../hooks/useNotificationContext.jsx";
import {isNumber} from "chart.js/helpers";

export const Filter = () => {
    const [queryParams, setQueryParams] = useSearchParams();
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const {showNotification} = useNotificationContext()
    return (
        <>
            <div className={'filter-container d-flex justify-content-start'}>
                <div className={'filter-component'}>
                    <h4>Sắp xếp theo giá</h4>
                    <div className={'d-flex justify-content-start'}>
                        <div className={'filter-item'}
                             onClick={() => {
                                 queryParams.delete('page');
                                 queryParams.set('sort', 'base_price');
                                 queryParams.set('sort_dir', 'asc');
                                 setQueryParams(queryParams, {replace: true})
                             }}
                        >
                            <img style={{height: '15px', width: '15px'}}
                                 className={'icon-link'}
                                 src={ascSortLogo}
                            />
                            <span>Tăng dần</span>
                        </div>
                        <div className={'filter-item'}
                             onClick={() => {
                                 queryParams.delete('page');
                                 queryParams.set('sort', 'base_price');
                                 queryParams.set('sort_dir', 'desc');
                                 setQueryParams(queryParams, {replace: true})
                             }}
                        >
                            <img style={{height: '15px', width: '15px'}}
                                 className={'icon-link'}
                                 src={descSortLogo}/>
                            <span>Giảm dần</span>
                        </div>
                    </div>
                </div>
                <div className={'filter-component'}>
                    <h4>Khoảng giá</h4>
                    <div className={'d-flex justify-content-start'}>
                        <input className={'price-input'}
                               placeholder={`Từ`}
                               value={minPrice ? minPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ""}
                               onChange={(e) => {
                                   const rawValue = e.target.value.replace(/\./g, '');
                                   if (!isNaN(Number(rawValue))) {
                                       setMinPrice(rawValue);
                                   }
                               }}
                        />
                        <input className={'price-input'}
                               placeholder={`Đến`}
                               value={maxPrice ? maxPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ""}
                               onChange={(e) => {
                                   const rawValue = e.target.value.replace(/\./g, '');
                                   if (!isNaN(Number(rawValue))) {
                                       setMaxPrice(rawValue);
                                   }
                               }}
                        />
                        <button className={'btn btn-primary'}
                                onClick={() => {
                                    if (!isNumber(maxPrice) || !isNumber(minPrice)) {
                                        showNotification('Invalid price')
                                        setMinPrice("");
                                        setMaxPrice("");
                                        return
                                    }
                                    if (parseInt(maxPrice) < parseInt(minPrice)) {
                                        showNotification('Maximum price can not be lower than minimum price')
                                        setMinPrice("");
                                        setMaxPrice("");
                                        return
                                    }
                                    queryParams.delete('page');
                                    queryParams.delete('sort');
                                    queryParams.delete('sort_dir');
                                    queryParams.set('min_price', minPrice);
                                    queryParams.set('max_price', maxPrice);
                                    setQueryParams(queryParams)
                                    setMinPrice("");
                                    setMaxPrice("");
                                }}
                        >Lọc</button>
                    </div>
                </div>
            </div>
        </>
    )
}
