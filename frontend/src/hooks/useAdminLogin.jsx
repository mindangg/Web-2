import { useState } from 'react'
import { useAdminContext } from './useAdminContext'
import { useNotificationContext } from '../hooks/useNotificationContext'

export const useAdminLogin = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const { dispatch } = useAdminContext()
    const { showNotification } = useNotificationContext()

    const login = async (email, password) => {
        setIsLoading(true)
        setError(null)
        try {
                const response = await fetch('http://localhost:8080/api/employee/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            })
        
            const json = await response.json()
        
            if (!response.ok) {
                setIsLoading(false)
                setError(json.error)
                throw new Error('Failed to login employee')
            }
        
            // save employee to local storage
            localStorage.setItem('employee', JSON.stringify(json))

            console.log(json.employee?.full_name)
            // show notification login
            showNotification(`Xin chào ${json.employee[0].full_name}`)
            
            // update the admin context
            dispatch({type: 'LOGIN', payload: json})
        }
        catch (error) {
            console.error(error)
        }
        finally {
            setIsLoading(false)
        }
    }

    return { login, error, isLoading }
}