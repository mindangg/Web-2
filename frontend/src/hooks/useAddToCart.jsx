import { useNotificationContext } from '../hooks/useNotificationContext'

export const useAddToCart = (product, userID) => {
    const { showNotification } = useNotificationContext()

    const addToCart = async () => {
        if (!userID) {
            showNotification('Please log in to add to cart')
            console.log('test')
            return
        }

        // if (stock <= 0) {
        //     showNotification('Out of stock')
        //     return
        // }

        let cart = JSON.parse(localStorage.getItem(`cart_${userID}`)) || []

        const exists = cart.some(item => item.id === product.id)
        
        if (exists) {
            cart = cart.map(item =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            )
        } 
        else
            cart.push({ ...product, quantity: 1 })
        
        localStorage.setItem(`cart_${userID}`, JSON.stringify(cart))
    }

    const deleteCart = async (userID, productID) => {
        if (productID)
            localStorage.removeItem(`cart_${userID}`)

        else {
            let cart = JSON.parse(localStorage.getItem(`cart_${userID}`)) || []
    
            cart = cart.filter(item => item.id !== productID)
    
            localStorage.setItem(`cart_${userID}`, JSON.stringify(cart))
        }
    }

    const handleQuantity = async (product, userID, type) => {
        let cart = JSON.parse(localStorage.getItem(`cart_${userID}`)) || []
        
        const item = cart.find(item => item.id === product.id)

        if (type === 'increase')
            item.quantity += 1

        else if (type === 'decrease') {
            if (item.quantity > 1)
                item.quantity += 1
            
            else
                deleteCart(userID)
        }

        localStorage.setItem(`cart_${userID}`, JSON.stringify(cart))
    }

    return { addToCart, deleteCart, handleQuantity }
}