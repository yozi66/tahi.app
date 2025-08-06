import { contextBridge, ipcRenderer } from 'electron'

console.log('Preload script is running!')

// Custom APIs for renderer
const api = {
  getVersions: () => ipcRenderer.invoke('get-versions'),
  ping: () => ipcRenderer.send('ping')
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.api = api
}
