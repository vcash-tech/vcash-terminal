// @ts-check
// This file should be compiled using the electron/tsconfig.main.json config
// which has "module": "Node16" to support ES module features like import.meta
import { app, BrowserWindow, ipcMain, screen } from 'electron'
import * as fs from 'fs'
import * as http from 'http'
import * as https from 'https'
import * as path from 'path'
import { fileURLToPath } from 'url'

import {
    activateApiResponse,
    apiResponse,
    executeActivate,
    executeDeactivate,
    executePrint
} from './peripherals.js'

// ES module equivalent for __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Check if running in development mode
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

// Logging setup
const vCashPath = `./`
const logFilePath = path.join(vCashPath, 'application.log')

// Ensure log directory exists
if (!fs.existsSync(vCashPath)) {
    fs.mkdirSync(vCashPath, { recursive: true })
}

// Function to write log entries
const writeLog = (level: string, message: string, source: string = 'MAIN') => {
    const timestamp = new Date().toISOString()
    const logEntry = `[${timestamp}] [${source}] [${level}] ${message}\n`

    try {
        fs.appendFileSync(logFilePath, logEntry, 'utf8')
    } catch (error) {
        // Fallback to original console if file writing fails
        console.error('Failed to write to log file:', error)
    }
}

// Override console methods for main process
const originalConsole = {
    log: console.log,
    error: console.error,
    warn: console.warn,
    info: console.info,
    debug: console.debug
}

console.log = (...args) => {
    const message = args
        .map((arg) =>
            typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        )
        .join(' ')
    writeLog('INFO', message)
    originalConsole.log(...args)
}

console.error = (...args) => {
    const message = args
        .map((arg) =>
            typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        )
        .join(' ')
    writeLog('ERROR', message)
    originalConsole.error(...args)
}

console.warn = (...args) => {
    const message = args
        .map((arg) =>
            typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        )
        .join(' ')
    writeLog('WARN', message)
    originalConsole.warn(...args)
}

console.info = (...args) => {
    const message = args
        .map((arg) =>
            typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        )
        .join(' ')
    writeLog('INFO', message)
    originalConsole.info(...args)
}

console.debug = (...args) => {
    const message = args
        .map((arg) =>
            typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        )
        .join(' ')
    writeLog('DEBUG', message)
    originalConsole.debug(...args)
}

// Log application startup
console.log('Electron application starting...')

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
        win.loadURL('http://localhost:5173') // TODO: Correct path or use mocked API since CORS prevent loading data from server
        // win.loadURL('https://terminal-app-two.vercel.app')
        // Only open DevTools when explicitly requested through an env variable
        if (process.env.OPEN_DEVTOOLS === 'true') {
            win.webContents.openDevTools()
        }
    } else {
        // Production mode - load from built files
        win.loadURL('http://localhost:5173')
    }

    // Inject console override script once the page is ready
    win.webContents.once('dom-ready', () => {
        win.webContents.executeJavaScript(`
            // Override console methods in renderer process
            const originalRendererConsole = {
                log: console.log,
                error: console.error,
                warn: console.warn,
                info: console.info,
                debug: console.debug
            };

            const sendToMain = (level, args) => {
                const message = args.map(arg => {
                    if (typeof arg === 'object') {
                        try {
                            return JSON.stringify(arg, null, 2);
                        } catch (e) {
                            return String(arg);
                        }
                    }
                    return String(arg);
                }).join(' ');
                
                if (window.api && window.api.sendLog) {
                    window.api.sendLog(level, message);
                }
            };

            console.log = (...args) => {
                sendToMain('INFO', args);
                originalRendererConsole.log(...args);
            };

            console.error = (...args) => {
                sendToMain('ERROR', args);
                originalRendererConsole.error(...args);
            };

            console.warn = (...args) => {
                sendToMain('WARN', args);
                originalRendererConsole.warn(...args);
            };

            console.info = (...args) => {
                sendToMain('INFO', args);
                originalRendererConsole.info(...args);
            };

            console.debug = (...args) => {
                sendToMain('DEBUG', args);
                originalRendererConsole.debug(...args);
            };

            // Capture unhandled errors
            window.addEventListener('error', (event) => {
                sendToMain('ERROR', [\`Unhandled Error: \${event.error?.message || event.message}\`, event.error?.stack || '']);
            });

            // Capture unhandled promise rejections
            window.addEventListener('unhandledrejection', (event) => {
                sendToMain('ERROR', [\`Unhandled Promise Rejection: \${event.reason}\`]);
            });

            console.log('Client-side console logging initialized');
        `)
    })

    return win
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
    const userDataPath = `C:\\VCash\\UI`
    return path.join(userDataPath, 'device-token.txt')
}

ipcMain.handle(
    'saveDeviceToken',
    async (_event, token: string): Promise<boolean> => {
        try {
            const tokenFilePath = getTokenFilePath()
            const vCashPath = `C:\\VCash\\UI`

            // Ensure the VCash directory exists
            if (!fs.existsSync(vCashPath)) {
                fs.mkdirSync(vCashPath, { recursive: true })
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
    async (_event, jwt: string): Promise<activateApiResponse> => {
        return await executeActivate(jwt)
    }
)

ipcMain.handle('deactivate', async (_event): Promise<void> => {
    await executeDeactivate()
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

// IPC handler for client-side logs
ipcMain.handle('sendLog', async (_event, level: string, message: string) => {
    writeLog(level, message, 'RENDERER')
})
