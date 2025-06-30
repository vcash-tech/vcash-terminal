import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
    print: (url: string) => ipcRenderer.invoke('print', url),
    activate: (jwt: string) => ipcRenderer.invoke('activate', jwt),
    deactivate: () => ipcRenderer.invoke('deactivate')
})
