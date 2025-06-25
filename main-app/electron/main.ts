import { app, BrowserWindow, ipcMain } from 'electron'
import * as path from 'path'
import { fileURLToPath } from 'url'

// ES module equivalent for __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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

  win.loadURL('http://localhost:5173')
}

app.whenReady().then(createWindow)

ipcMain.handle('print', (_event, voucherCode) => {
    // Here you would implement the actual printing logic

    return voucherCode
})
