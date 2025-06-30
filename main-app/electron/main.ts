import { app, BrowserWindow, ipcMain, screen } from 'electron'
import * as fs from 'fs'
import * as http from 'http'
import * as https from 'https'
import * as path from 'path'
import { fileURLToPath } from 'url'

import {
    apiResponse,
    executeActivate,
    executeDeactivate,
    executePrint
} from './peripherals.js'

// ES module equivalent for __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Check if running in development mode
const isDev = !app.isPackaged

function createWindow() {
    const primaryScreen = screen.getPrimaryDisplay()
    const win = new BrowserWindow({
        width: isDev ? 1920 : primaryScreen.bounds.width * 0.8,
        height: isDev ? 1080 : primaryScreen.bounds.height * 0.8,
        fullscreen: !isDev,
        frame: isDev,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // Built output of preload.ts
            contextIsolation: true,
            nodeIntegration: false
        }
    })

    if (isDev) {
        // Development mode - load from Vite dev server
        win.loadURL('http://localhost:5173')
        win.webContents.openDevTools()
    } else {
        // Production mode - load from built files
        win.loadURL('https://terminal-app-two.vercel.app')
    }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

// Path to store the device token
const getTokenFilePath = (): string => {
    const userDataPath = app.getPath('userData')
    return path.join(userDataPath, 'device-token.txt')
}

ipcMain.handle(
    'saveDeviceToken',
    async (_event, token: string): Promise<boolean> => {
        try {
            const tokenFilePath = getTokenFilePath()

            // Ensure the user data directory exists
            const userDataPath = app.getPath('userData')
            if (!fs.existsSync(userDataPath)) {
                fs.mkdirSync(userDataPath, { recursive: true })
            }

            // Write the token to the file
            fs.writeFileSync(tokenFilePath, token, 'utf8')
            return true
        } catch (error) {
            console.error('Failed to save device token:', error)
            return false
        }
    }
)

ipcMain.handle('getDeviceToken', async (_event): Promise<string> => {
    try {
        const tokenFilePath = getTokenFilePath()

        // Check if the file exists
        if (!fs.existsSync(tokenFilePath)) {
            return ''
        }

        // Read and return the token
        const token = fs.readFileSync(tokenFilePath, 'utf8')
        return token.trim()
    } catch (error) {
        console.error('Failed to read device token:', error)
        return ''
    }
})

ipcMain.handle(
    'activate',
    async (_event, jwt: string): Promise<apiResponse> => {
        return executeActivate(jwt)
    }
)

ipcMain.handle('deactivate', async (_event): Promise<apiResponse> => {
    return executeDeactivate()
})

ipcMain.handle('print', async (_event, url: string): Promise<apiResponse> => {
    try {
        // Determine which module to use based on the URL protocol
        const isHttps = url.startsWith('https:')
        const httpModule = isHttps ? https : http

        return new Promise((resolve, reject) => {
            const request = httpModule.get(url, (response) => {
                // Check if the response is successful
                if (response.statusCode !== 200) {
                    reject(
                        new Error(
                            `Failed to download image. Status code: ${response.statusCode}`
                        )
                    )
                    return
                }

                const chunks: Buffer[] = []

                // Collect data chunks
                response.on('data', (chunk) => {
                    chunks.push(chunk)
                })

                // When download is complete, convert to base64
                response.on('end', () => {
                    const buffer = Buffer.concat(chunks)
                    const base64String = buffer.toString('base64')
                    executePrint(base64String)
                        .then((response: apiResponse) => {
                            resolve(response)
                        })
                        .catch((error: Error) => {
                            reject(error)
                        })
                })
            })

            // Handle request errors
            request.on('error', (error) => {
                reject(new Error(`Failed to download image: ${error.message}`))
            })

            // Set a timeout for the request
            request.setTimeout(30000, () => {
                request.destroy()
                reject(
                    new Error(
                        'Request timeout - failed to download image within 30 seconds'
                    )
                )
            })
        })
    } catch (error) {
        throw new Error(
            `Error downloading image: ${error instanceof Error ? error.message : 'Unknown error'}`
        )
    }
})
