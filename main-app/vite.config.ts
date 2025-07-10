import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// Recreate __dirname for ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig(() => {
    // Load env file based on `mode` in the current directory.
    // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
    // const env = loadEnv(mode, process.cwd(), '')

    // Default API URL if not provided in environment
    // const apiUrl = env.VITE_API_URL || 'http://localhost:8181'

    return {
        plugins: [
            react(),
            VitePWA({
                registerType: 'autoUpdate', // auto update when new version is available
                manifest: {
                    name: 'Vcash Terminal',
                    short_name: 'Vcash',
                    start_url: '/',
                    display: 'standalone',
                    icons: [],
                },
                workbox: {
                    runtimeCaching: [
                    {
                        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
                        handler: 'CacheFirst',
                        options: {
                        cacheName: 'images-cache',
                        expiration: {
                            maxEntries: 100,
                            maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                        },
                        },
                    },
                    ],
                },
            }),
        ],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src')
            }
        }
        // server: {
        //     proxy: {
        //         // Proxy all API requests to backend server
        //         '^/auth/.*': {
        //             target: apiUrl,
        //             changeOrigin: true,
        //             secure: false
        //         }
        //     }
        // }
    }
})
