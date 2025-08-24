import { ipcMain } from 'electron';
import { sampleList } from '@main/data/sampleListState';
import { writeFileSync } from 'fs';
import path from 'path';

const filePath = path.join(__dirname, 'sampleList.json');

export function setupIpcHandlers(): void {
  // IPC test
  ipcMain.on('ping', () => console.log('pong'));

  // Handle versions request from renderer process
  ipcMain.handle('get-versions', () => {
    return process.versions;
  });

  ipcMain.handle('save', async (_event, payload) => {
    console.log(`Save action triggered with ${payload.length} items`);
    try {
      writeFileSync(filePath, JSON.stringify(payload, null, 2), 'utf-8');
      console.log(`Data successfully saved to ${filePath}`);
    } catch (error) {
      console.error('Error saving data:', error);
      return { success: false };
    }
    return { success: true };
  });

  ipcMain.handle('get_list', async () => {
    return sampleList;
  });
}
