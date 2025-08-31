import { ipcMain } from 'electron';
import { sampleList } from '@main/state/sampleListState';
import { MainState } from '@main/state/MainStateType';
import { loadTodoList, saveTodoList } from '@main/repository/TodoListRepository';

export function setupIpcHandlers(mainState: MainState): void {
  // IPC test
  ipcMain.on('ping', () => console.log('pong'));

  // Handle versions request from renderer process
  ipcMain.handle('get-versions', () => {
    return process.versions;
  });

  ipcMain.handle('load', async (_event) => {
    void _event; // make eslint ignore the unused _event parameter
    return loadTodoList(mainState);
  });

  ipcMain.handle('save', async (_event, payload) => {
    return saveTodoList(payload, mainState);
  });

  ipcMain.handle('get_list', async () => {
    return sampleList;
  });
}
