import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import App from './App.jsx'
import {AdminContextProvider} from './contexts/AdminContext.jsx'
import {AuthContextProvider} from './contexts/AuthContext.jsx'
import {NotificationContextProvider} from './contexts/NotificationContext.jsx'
import {CardDetailsContextProvider} from './contexts/CardDetailsContext.jsx'
import {UserContextProvider} from './contexts/UserContext.jsx'
import {CartContextProvider} from './contexts/CartContext.jsx'
import {HeaderContextProvider} from "./contexts/HeaderContext.jsx";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AdminContextProvider>
            <AuthContextProvider>
                <UserContextProvider>
                    <HeaderContextProvider>
                        <CartContextProvider>
                            <NotificationContextProvider>
                                <CardDetailsContextProvider>
                                    <App/>
                                </CardDetailsContextProvider>
                            </NotificationContextProvider>
                        </CartContextProvider>
                    </HeaderContextProvider>
                </UserContextProvider>
            </AuthContextProvider>
        </AdminContextProvider>
    </StrictMode>,
)
