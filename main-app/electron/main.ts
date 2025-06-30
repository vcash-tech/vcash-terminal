import { app, BrowserWindow, ipcMain } from 'electron'
import * as http from 'http'
import * as https from 'https'
import * as path from 'path'
import { fileURLToPath } from 'url'

// ES module equivalent for __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Check if running in development mode
const isDev = !app.isPackaged

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
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

ipcMain.handle('activate', async (_event, jwt: string) => {
    console.log('Activating with JWT:', jwt)
})

ipcMain.handle('deactivate', async (_event) => {
    console.log('Deactivating')
})

ipcMain.handle('print', async (_event, url: string): Promise<string> => {
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
                    resolve(base64String)
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
