import { createContext, useEffect, useReducer } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'

export const CartContext = createContext();

export const cartReducer = (state, action) => {
    switch(action.type) {

        case 'DISPLAY_ITEM':
            return {
                cart: action.payload
            }

        // case 'ADD_ITEM':
        //     const exists = state.cart.items.find(
        //         (item) =>
        //             item.product.product_id === action.payload.product.product_id &&
        //             item.sku.some(s => action.payload.sku.some(pSku => pSku.sku_id === s.sku_id))
        //     )

        //     if (exists) {
        //         return {
        //             cart: {
        //                 items: state.cart.items.map((item) =>
        //                     item.product.product_id === action.payload.product.product_id &&
        //                     item.sku.some(s => action.payload.sku.some(pSku => pSku.sku_id === s.sku_id))
        //                         ? { ...item, quantity: item.quantity + action.payload.quantity }
        //                         : item
        //                 )
        //             }
        //         }
        //     } else {
        //         return {
        //             cart: {
        //                 items: [...state.cart.items, action.payload]
        //             }
        //         }
        //     }

        case 'DELETE_ITEM':
            return {
                cart: state.cart.filter(i => i.sku_id !== action.payload)
            }

        case 'UPDATE_QUANTITY':
            console.log('update', action.payload.quantity)
            console.log('cart', state.cart[0].quantity)
            return {
                cart: state.cart.map(i =>
                    i.sku_id === action.payload.sku_id
                        ? { ...i, quantity: action.payload.quantity }
                        : i
                )
            }            

        case 'CLEAR_ITEM':
            return {
                cart: []
            }  
            
        default:
            return state
    }
}

export const CartContextProvider = ({ children }) => {
    const {user} = useAuthContext();
    const [state, dispatch] = useReducer(cartReducer, {
        cart: []
    })
    useEffect(() => {
        if(user){
            const userId = user.user.user_account_id;
            const storedCart = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
            dispatch({type: 'DISPLAY_ITEM', payload: storedCart});
        }
    },[user]);

    return (
        <CartContext.Provider value={{...state, dispatch}}>
            { children }
        </CartContext.Provider>
    )
}