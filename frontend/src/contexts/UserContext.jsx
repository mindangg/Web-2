import { createContext, useReducer } from 'react'

export const UserContext = createContext()

export const userReducer = (state, action) => {
    switch(action.type){
        case 'SET_USER':
            return { 
                users: action.payload 
            }

        case 'ADD_USER':
            return { 
                users: [...state.users, action.payload]
            }

        case 'DELETE_USER':
            return { 
                users: state.users.filter(u => u.user_account_id !== action.payload) 
            }

        case 'UPDATE_USER':
            return { 
                users: state.users.map(u => u.user_account_id !== action.payload.user_account_id ? action.payload : u) 
            }
            
        default:
            return state
    }
}

export const UserContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(userReducer, {
        users: []
    })

    return (
        <UserContext.Provider value={{...state, dispatch}}>
            { children }
        </UserContext.Provider>
    )
}