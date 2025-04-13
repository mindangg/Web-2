import { useNotificationContext } from '../hooks/useNotificationContext'
import { useAuthContext } from './useAuthContext'
import { useCartContext } from '../contexts/useCartContext'

export const useAddToCart = () => {
    const { showNotification } = useNotificationContext()
    const { user } = useAuthContext()

    const {updateCart} = useCartContext()
    const addToCart = async (product) => {
        // const userId = user?.user_account_id || 1
        if (!user) {
            showNotification('Please log in to add to cart')
            return
        }
        // console.log('Current user:', user)
        const userId = user.user.user_account_id

        // if (stock <= 0) {
        //     showNotification('Out of stock')
        //     return
        // }

        let cart = JSON.parse(localStorage.getItem(`cart_${userId}`)) || []

        console.log('Current product ID:', product.product_id); // Kiểm tra ID sản phẩm
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

    const deleteCart = async ( productID) => {
        const userId = user.user.user_account_id
        try{
            let cart = JSON.parse(localStorage.getItem(`cart_${userId}`)) || []
             
            cart = cart.filter(item => item.product_id !== productID)
            localStorage.setItem(`cart_${userId}`,JSON.stringify(cart))
            updateCart(cart)
            showNotification("Đã xóa sản phẩm khỏi giỏ hàng")
        }
        catch(error){
            console.error('Lỗi khi xóa giỏ hàng:', error)
            showNotification('Có lỗi xảy ra khi xóa sản phẩm')
        }
    }

    const handleQuantity = async (product, type) => {
        const userId = user.user.user_account_id
        try{
            let cart = JSON.parse(localStorage.getItem(`cart_${userId}`)) || []
            const itemIndex = cart.findIndex(item => item.product_id === product.product_id)
            if(itemIndex === -1) return

            const updateItem = {...cart[itemIndex]}

            if (type === 'increase') {
                updateItem.quantity += 1
            } 
            else if (type === 'decrease') {
                if (updateItem.quantity > 1) {
                    updateItem.quantity -= 1 // Sửa từ += thành -=
                } else {
                    // Nếu số lượng = 1 và click giảm, xóa sản phẩm
                    await deleteCart( product.product_id)
                    return
                }
            }

        cart[itemIndex] = updateItem
        localStorage.setItem(`cart_${userId}`, JSON.stringify(cart))
        updateCart(cart)
            
        }
        catch(error){
            console.error("Lỗi khi thay đổi số lượng: ", error)
            showNotification("Có lỗi xảy ra khi cập nhật số lượng")
        }
    }

    return { addToCart, deleteCart, handleQuantity }
}