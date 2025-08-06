import './i18n/i18n'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'

import App from './App.tsx'
import { apiService } from './services/apiService'
import { deviceTokenService } from './services/deviceTokenService'

// Override console methods to send logs to API service
const setupConsoleOverride = () => {
    const originalConsole = {
        log: console.log,
        error: console.error,
        warn: console.warn,
        info: console.info
    }

    const createLogOverride = (
        level: string,
        originalMethod: typeof console.log
    ) => {
        return (...args: unknown[]) => {
            // Always call original console method first
            originalMethod.apply(console, args)

            // Safely attempt to send to API service
            try {
                const message = args
                    .map((arg) =>
                        typeof arg === 'object'
                            ? JSON.stringify(arg)
                            : String(arg)
                    )
                    .join(' ')

                // Fire and forget - don't await to avoid blocking
                apiService.sendLog(level, message).catch(() => {
                    // Silently ignore API errors to prevent infinite loops
                })
            } catch {
                // Silently ignore any errors in the override itself
            }
        }
    }

    console.log = createLogOverride('info', originalConsole.log)
    console.error = createLogOverride('error', originalConsole.error)
    console.warn = createLogOverride('warn', originalConsole.warn)
    console.info = createLogOverride('info', originalConsole.info)
}

// Setup console override as early as possible
setupConsoleOverride()

registerSW({
    onNeedRefresh() {
        console.log('⚙️ Service worker update available, reloading app... test')
        if (navigator.onLine) {
            window.location.reload()
        }
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
