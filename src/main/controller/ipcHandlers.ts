import { ipcMain } from 'electron';
import { sampleList } from '@main/state/sampleListState';
import { MainState } from '@main/state/MainState';
import { loadTodoList, saveTodoList, saveTodoListAs } from '@main/repository/TodoListRepository';

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

  ipcMain.handle('save', async (_event, items, saveAs) => {
    return saveAs ? saveTodoListAs(items, mainState) : saveTodoList(items, mainState);
  });

  ipcMain.handle('get_list', async () => {
    return sampleList;
  });

  ipcMain.handle('apply-change', async (_event, change) => {
    void _event; // make eslint ignore the unused _event parameter
    console.log('Received change:', change.type);
    return mainState.applyChange(change);
  });

  ipcMain.handle('undo', async () => {
    return mainState.undo();
  });

  ipcMain.handle('redo', async () => {
    return mainState.redo();
  });
}
