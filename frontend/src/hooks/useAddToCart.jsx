import { useNotificationContext } from './useNotificationContext'
import { useAuthContext } from './useAuthContext'
import { useCartContext } from './useCartContext'

export const useAddToCart = () => {
    const { showNotification } = useNotificationContext()
    const { user } = useAuthContext()
    const { dispatch } = useCartContext()

    const addToCart = async (product) => {
        console.log('product', product.stock)
        // console.log('product', product)
        if (!user) {
            showNotification('Vui lòng đăng nhập để thêm vào giỏ hàng')
            return
        }

        if (product.stock <= 0) {
            showNotification('Sản phẩm hết hàng')
            return
        }

        const userId = user.user.user_account_id

        let cart = JSON.parse(localStorage.getItem(`cart_${userId}`)) || []

        const exists = cart.some(item => item.sku_id === product.sku_id)
        
        if (exists) {
            cart = cart.map(item =>
                item.sku_id === product.sku_id ? { ...item, quantity: item.quantity + 1 } : item
            )
        } 
        else
            cart.push({ ...product, quantity: 1 })
        
        localStorage.setItem(`cart_${userId}`, JSON.stringify(cart))

        showNotification('Đã thêm sản phẩm vào giỏ hàng')
    }

    const handleDelete = async (productID) => {
        const userId = user.user.user_account_id
        try{
            let cart = JSON.parse(localStorage.getItem(`cart_${userId}`)) || []
             
            cart = cart.filter(item => item.sku_id !== productID)

            localStorage.setItem(`cart_${userId}`,JSON.stringify(cart))

            dispatch({type: 'DELETE_ITEM', payload: productID})

            showNotification("Đã xóa sản phẩm khỏi giỏ hàng")
        }
        catch(error){
            console.error('Lỗi khi xóa giỏ hàng:', error)
            showNotification('Có lỗi xảy ra khi xóa sản phẩm')
        }
    }

    const handleQuantity = async (product, type, quantity) => {
        const userId = user.user.user_account_id
        try{
            let cart = JSON.parse(localStorage.getItem(`cart_${userId}`)) || []
            const itemIndex = cart.findIndex(item => item.sku_id === product.sku_id)

            if(itemIndex === -1) 
                return

            const updateItem = {...cart[itemIndex]}

            if (type === 'increase') {
                if (updateItem.quantity >= product.stock) {
                    showNotification('Sản phẩm hết hàng')
                    return
                }

                updateItem.quantity += 1
            } 
            else if (type === 'decrease')
                if (updateItem.quantity > 1)
                    updateItem.quantity -= 1

                else {
                    // Nếu số lượng = 1 và click giảm, xóa sản phẩm
                    handleDelete(product.product.product_id)
                    return
                }
            else if (type === 'set') {
                updateItem.quantity = quantity
            }

        cart[itemIndex] = updateItem
        localStorage.setItem(`cart_${userId}`, JSON.stringify(cart))
        // console.log(cart)
        dispatch({type: 'UPDATE_QUANTITY', payload: cart[itemIndex]})
            
        }
        catch(error){
            console.error("Lỗi khi thay đổi số lượng: ", error)
            showNotification("Có lỗi xảy ra khi cập nhật số lượng")
        }
    }

    return { addToCart, handleDelete, handleQuantity }
}