import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { ProfileProvider } from './context/ProfileContext'
import { NotificationProvider } from './context/NotificationContext'
import { NotesProvider } from './context/NotesContext'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>        {/* Сначала AuthProvider */}
        <ProfileProvider>    {/* Потом ProfileProvider (зависит от AuthProvider) */}
          <NotificationProvider>
            <NotesProvider>
              <App />
            </NotesProvider>
          </NotificationProvider>
        </ProfileProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)