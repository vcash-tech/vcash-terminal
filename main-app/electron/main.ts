import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import { execFile } from "child_process";

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // Built output of preload.ts
    },
  });

  win.loadURL("http://localhost:5173");
}

app.whenReady().then(createWindow);

ipcMain.handle("print", (_event, voucherCode) => {
  const exePath = path.join(__dirname, "printVoucher.exe"); // adjust path to your .exe

  return voucherCode;

  return new Promise((resolve, reject) => {
    execFile(exePath, [voucherCode], (error, stdout, stderr) => {
      if (error) {
        console.error("Execution failed:", error);
        reject(stderr);
        return;
      }
      console.log("Output:", stdout);
      resolve(stdout);
    });
  });
});
