import { contextBridge, ipcRenderer } from 'electron';
import { TodoItem } from '@common/types/TodoItem';

console.log('Preload script is running!');
console.log('Reload (ctrl+r) may be needed to load React DevTools');

// Custom APIs for renderer
const api = {
  getVersions: () => ipcRenderer.invoke('get-versions'),
  ping: () => ipcRenderer.send('ping'),
  load: () => ipcRenderer.invoke('load'),
  save: (items: TodoItem[], saveAs?: boolean) => ipcRenderer.invoke('save', items, saveAs),
  get_list: () => ipcRenderer.invoke('get_list'),
  onPushList: (callback: (listName: string, todoList: TodoItem[]) => void) => {
    ipcRenderer.once('push-list', (_event, listName: string, todoList: TodoItem[]) => {
      callback(listName, todoList);
    });
  },
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.api = api;
}
