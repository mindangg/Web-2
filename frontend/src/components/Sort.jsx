import {useSearchParams} from "react-router-dom";
import '../styles/Sort.css'
import ascSortLogo from '../assets/ascending-sort.svg'
import descSortLogo from '../assets/descending-sort.svg'

export const Sort = () => {
    const [queryParams, setQueryParams] = useSearchParams();
    return (
        <>
            <div className={'sort-container'}>
                <h4>Sort by</h4>
                <div className={'d-flex justify-content-start'}>
                    <div className={'sort-item'}>
                        <img className={'icon-link'} src={ascSortLogo}
                             onClick={() => setQueryParams({sort: 'asc'})}/>
                        Price increasing
                    </div>
                    <div className={'sort-item'}>
                        <img className={'icon-link'} src={descSortLogo}
                             onClick={() => setQueryParams({sort: 'desc'})}/>
                        Price increasing
                    </div>
                </div>
            </div>
        </>
    )
}
