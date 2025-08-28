import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// Recreate __dirname for ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig(() => {
    // Default API URL if not provided in environment
    // const apiUrl = env.VITE_API_URL || 'http://localhost:8181'

    // Generate build timestamp
    const buildTimestamp = new Date().toLocaleString('sr-RS', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Belgrade'
    })

    return {
        define: {
            __BUILD_TIMESTAMP__: JSON.stringify(buildTimestamp)
        },
        plugins: [
            react(),
            VitePWA({
                registerType: 'autoUpdate', // auto update when new version is available
                manifest: {
                    name: 'Vcash Terminal',
                    short_name: 'Vcash',
                    start_url: '/',
                    display: 'standalone',
                    icons: []
                },
                workbox: {
                    globPatterns: ['**/*.{js,css,html,png,jpg,jpeg,svg,webp}'],
                    cleanupOutdatedCaches: true
                }
            })
        ],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src')
            }
        },
        server: {
            allowedHosts: ['localhost', 'irreal.eu.ngrok.io']
            //     proxy: {
            //         // Proxy all API requests to backend server
            //         '^/auth/.*': {
            //             target: apiUrl,
            //             changeOrigin: true,
            //             secure: false
            //         }
            //     }
        }
    }
})
