import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
    print: (url: string) => ipcRenderer.invoke('print', url),
    activate: (jwt: string) => ipcRenderer.invoke('activate', jwt),
    deactivate: () => ipcRenderer.invoke('deactivate'),
    saveDeviceToken: (token: string) =>
        ipcRenderer.invoke('saveDeviceToken', token),
    getDeviceToken: () => ipcRenderer.invoke('getDeviceToken'),
    sendLog: (level: string, message: string) =>
        ipcRenderer.invoke('sendLog', level, message)
})
