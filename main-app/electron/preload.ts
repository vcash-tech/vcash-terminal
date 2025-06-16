import { contextBridge, ipcRenderer } from "electron"

contextBridge.exposeInMainWorld("api", {
  print: (voucherCode: string) => ipcRenderer.invoke("print", voucherCode),
})
