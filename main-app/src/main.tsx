import './i18n/i18n'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'

import App from './App.tsx'
import { deviceTokenService } from './services/deviceTokenService'

registerSW({
    onNeedRefresh() {
        window.location.reload()
    }
})

// Initialize device token service and then render app
async function initializeApp() {
    try {
        await deviceTokenService.initialize()
    } catch (error) {
        console.error('Failed to initialize device token service:', error)
    }

    createRoot(document.getElementById('root')!).render(
        <StrictMode>
            <App />
        </StrictMode>
    )
}

initializeApp()
