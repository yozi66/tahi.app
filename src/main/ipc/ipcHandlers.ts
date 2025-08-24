import { ipcMain } from 'electron';
import { sampleList } from '@main/data/sampleListState';

export function setupIpcHandlers(): void {
  // IPC test
  ipcMain.on('ping', () => console.log('pong'));

  // Handle versions request from renderer process
  ipcMain.handle('get-versions', () => {
    return process.versions;
  });

  ipcMain.handle('save', async (_event, payload) => {
    console.log(`Save action triggered with ${payload.length} items`);
    // Implement save logic here
    return { success: true };
  });

  ipcMain.handle('get_list', async () => {
    return sampleList;
  });
}
