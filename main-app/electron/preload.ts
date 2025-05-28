import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  print: () => ipcRenderer.invoke("print"),
});
