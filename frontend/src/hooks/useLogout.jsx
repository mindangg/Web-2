import { useAuthContext } from './useAuthContext'
import { useNotificationContext } from './useNotificationContext'
// import { useCartContext } from './useCartContext'

export const useLogout = () => {
    const { dispatch } = useAuthContext()
    const { showNotification } = useNotificationContext()
    // const { dispatch: cartDispatch } = useCartContext()

    const logout = () => {
        // remove user from local storage
        localStorage.removeItem('user')
        
        // show notification logout
        showNotification(`Hẹn gặp lại`)

        // dispatch logout action'
        dispatch({ type: 'LOGOUT' })
        // cartDispatch({type: 'CLEAR_ITEM'})
    }

    return { logout }
}