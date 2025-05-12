import {createContext, useEffect, useState} from "react";
import {API_URL} from "../utils/Constant.jsx";

export const HeaderContext = createContext()

export const HeaderContextProvider = ({ children }) => {
    const [brands, setBrands] = useState([]);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        const fetchBrands = async () => {
            try {
                const response = await fetch(`${API_URL}brand`, { signal });
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                setBrands(data.brands);
            } catch (error) {
                if (error.name === 'AbortError') {
                    console.log('Fetch aborted');
                } else {
                    console.error(error);
                }
            }
        };
        fetchBrands()
        return () => {
            controller.abort();
        };
    }, []);

    return (
        <HeaderContext.Provider value={{brands}}>
            { children }
        </HeaderContext.Provider>
    )
}