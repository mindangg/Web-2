import {useSearchParams} from "react-router-dom";
import '../../styles/Filter.css'
import ascSortLogo from '../../assets/ascending-sort.svg'
import descSortLogo from '../../assets/descending-sort.svg'
import {useState} from "react";
import {useNotificationContext} from "../../hooks/useNotificationContext.jsx";

export const Filter = () => {
    const [queryParams, setQueryParams] = useSearchParams();
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const {showNotification} = useNotificationContext()
    return (
        <>
            <div className={'filter-container d-flex justify-content-start'}>
                <div className={'filter-component'}>
                    <h4>Sort by</h4>
                    <div className={'d-flex justify-content-start'}>
                        <div className={'filter-item'}
                             onClick={() => {
                                 queryParams.delete('page');
                                 queryParams.set('sort', 'base_price');
                                 queryParams.set('sort_dir', 'asc');
                                 setQueryParams(queryParams, {replace: true})
                             }}
                        >
                            <img className={'icon-link'} src={ascSortLogo}/>
                            <span>Price increasing</span>
                        </div>
                        <div className={'filter-item'}
                             onClick={() => {
                                 queryParams.delete('page');
                                 queryParams.set('sort', 'base_price');
                                 queryParams.set('sort_dir', 'desc');
                                 setQueryParams(queryParams, {replace: true})
                             }}
                        >
                            <img className={'icon-link'} src={descSortLogo}/>
                            <span>Price decreasing</span>
                        </div>
                    </div>
                </div>
                <div className={'filter-component'}>
                    <h4>Price range</h4>
                    <div className={'d-flex justify-content-start'}>
                        <input className={'price-input'}
                               placeholder={`From`}
                               value={`${minPrice}`}
                               onChange={(e) => {
                                   setMinPrice(e.target.value)
                               }}
                        />
                        <input className={'price-input'}
                               placeholder={`To`}
                               value={`${maxPrice}`}
                               onChange={(e) => {
                                   setMaxPrice(e.target.value)
                               }}
                        />
                        <button className={'btn btn-primary'}
                                onClick={() => {
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
                        >Apply</button>
                    </div>
                </div>
            </div>
        </>
    )
}
