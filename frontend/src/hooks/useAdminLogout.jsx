import { useAdminContext } from './useAdminContext'
import { useNotificationContext } from './useNotificationContext'

export const useAdminLogout = () => {
    const { dispatch } = useAdminContext()
    const { showNotification } = useNotificationContext()

    const logout = () => {
        // remove employee from local storage
        localStorage.removeItem('employee')
        
        // show notification logout
        showNotification(`Hẹn gặp lại`)

        // dispatch logout action'
        dispatch({ type: 'LOGOUT' })
    }

    return { logout }
}