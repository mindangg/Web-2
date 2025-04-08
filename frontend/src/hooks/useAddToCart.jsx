import { useNotificationContext } from '../hooks/useNotificationContext'
import { useAuthContext } from './useAuthContext'
import { useCartContext } from '../contexts/useCartContext'

export const useAddToCart = () => {
    const { showNotification } = useNotificationContext()
    const { user } = useAuthContext()

    const {updateCart} = useCartContext()
    const addToCart = async (product) => {
        const userId = user?.id || 1
        // if (!user) {
        //     showNotification('Please log in to add to cart')
        //     console.log('test')
        //     return
        // }

        // if (stock <= 0) {
        //     showNotification('Out of stock')
        //     return
        // }

        let cart = JSON.parse(localStorage.getItem(`cart_${userId}`)) || []

        console.log('Current product ID:', product.id); // Kiểm tra ID sản phẩm
        console.log('Current cart:', cart); // Kiểm tra giỏ hàng hiện tại

        const exists = cart.some(item => item.product_id === product.product_id)
        
        if (exists) {
            cart = cart.map(item =>
                item.product_id === product.product_id ? { ...item, quantity: item.quantity + 1 } : item
            )
        } 
        else
            cart.push({ ...product, quantity: 1 })
        
        localStorage.setItem(`cart_${userId}`, JSON.stringify(cart))
        updateCart(cart) // Cập nhật state giỏ hàng
        showNotification('Đã thêm sản phẩm vào giỏ hàng')
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