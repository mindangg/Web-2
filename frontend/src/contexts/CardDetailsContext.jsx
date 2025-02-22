import { createContext, useState } from 'react'

export const CardDetailsContext = createContext({
    phone: null,
    showProductInfo: () => {},
    clearPhone: () => {}
})

export const CardDetailsContextProvider = ({ children }) => {
    const [phone, setPhone] = useState(null)

    const showProductInfo = async (id) => {
        const response = await fetch('' + id)
        if (!response.ok) {
            setPhone(null)
            throw new Error('Failed to fetch manga details')
        }

        if (response.ok) {
            const phoneData = await response.json()
            setPhone(phoneData)
        }
    }

    const clearManga = () => {
        setPhone(null)
    }

    return (
        <CardDetailsContext.Provider value={{ phone, showProductInfo, clearPhone }}>
            { children }
        </CardDetailsContext.Provider>
    )
}