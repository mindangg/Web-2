import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import App from './App.jsx'
import { AuthContextProvider } from './contexts/AuthContext.jsx'
import { NotificationContextProvider } from './contexts/NotificationContext.jsx'
import { CardDetailsContextProvider } from './contexts/CardDetailsContext.jsx'
import { UserContextProvider } from './contexts/UserContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserContextProvider>
      <AuthContextProvider>
        <NotificationContextProvider>
          <CardDetailsContextProvider>
            <App />
          </CardDetailsContextProvider>
        </NotificationContextProvider>
      </AuthContextProvider>
    </UserContextProvider>
  </StrictMode>,
)
