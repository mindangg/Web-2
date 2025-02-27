import { useContext } from 'react'
import { CardDetailsContext } from '../contexts/CardDetailsContext'

export const useCardDetailsContext = () => {
    const context = useContext(CardDetailsContext)

    if (!context)
        throw new Error('useCardDetailsContext must be used in an CardDetailsContextProvider')

    return context
}