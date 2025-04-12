import { createContext, useContext, useState, useEffect } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([])
    const {user} = useAuthContext()

    // useEffect(() => {
    //     if (user) {
    //         const savedCart = JSON.parse(localStorage.getItem(`cart_${user.id}`)) || []
    //         setCart(savedCart)
    //     } else {
    //         setCart([])
    //     }
    // }, [user])

    useEffect(() => {
        if(user){
            const userId = user.user.user_account_id
            const savedCart = JSON.parse(localStorage.getItem(`cart_${userId}`)) || []
            setCart(savedCart)
        }
        else{
            setCart([])
        }
    }, [user])

    // const updateCart = (newCart) => {
    //     setCart(newCart)
    //     if (user) {
    //         localStorage.setItem(`cart_${user.id}`, JSON.stringify(newCart))
    //     }
    // }

    const updateCart = (newCart) => {
        setCart(newCart)
        const userId = user.user.user_account_id 
        localStorage.setItem(`cart_${userId}`, JSON.stringify(newCart))
    }

    return (
        <CartContext.Provider value={{ cart, updateCart }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCartContext = () => {
    return useContext(CartContext)
}