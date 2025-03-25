import React from 'react'
import '../styles/Pagination.css'
import {useSearchParams} from "react-router-dom";

export default function Pagination({totalPage, currentPage}) {
    const [searchParams, setSearchParams] = useSearchParams();
    const goToPrevPage = () => {
        if (currentPage > 1) {
            searchParams.set('page', currentPage - 1);
            setSearchParams(searchParams);
        }
    }
    const goToNextPage = () => {
        if (currentPage < totalPage) {
            searchParams.set('page', currentPage + 1);
            setSearchParams(searchParams);
        }
    }

    return (
        <>
            <ul className="pagination justify-content-center">
                <li className={`page-item page-link ${currentPage > 1 ? '' : 'disabled'}`}
                    onClick={goToPrevPage}>
                    <span aria-hidden="true">&laquo;</span>
                </li>
                {
                    [...Array(totalPage)].map((_, i) => (
                        <li key={i + 1}
                            className={`page-item page-link ${currentPage === i + 1 ? 'active' : ''}`}
                            onClick={() => {
                                searchParams.set('page', i + 1);
                                setSearchParams(searchParams)
                            }}
                        >
                            <span>{i + 1}</span>
                        </li>
                    ))
                }
                <li className={`page-item page-link ${currentPage < totalPage ? '' : 'disabled'}`}
                    onClick={goToNextPage}>
                    <span aria-hidden="true">&raquo;</span>
                </li>
            </ul>
        </>
    )
}