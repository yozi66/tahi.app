import { dialog } from 'electron';
import { TodoItem, isTodoItem } from '@common/types/TodoItem';
import { MainState } from '@main/state/MainState';
import { readFileSync, writeFileSync } from 'fs';

const saveTodoListAs = async (
  items: TodoItem[],
  mainState: MainState,
): Promise<{ success: boolean }> => {
  const options = {
    title: 'Save the todolist',
    defaultPath: 'sampleList.tahi',
    buttonLabel: 'Save',
    filters: [
      { name: 'Tahi Todolists', extensions: ['tahi'] },
      { name: 'JSON files', extensions: ['json'] },
    ],
  };

  return dialog.showSaveDialog(mainState.mainWindow, options).then((result) => {
    if (!result.canceled && result.filePath) {
      console.log('Save path: ', result.filePath);
      try {
        writeFileSync(result.filePath, JSON.stringify(items, null, 2), 'utf-8');
        console.log(`Data successfully saved to ${result.filePath}`);
        mainState.mainSettings.filepath = result.filePath;
        return { success: true, listName: result.filePath };
      } catch (error) {
        console.error('Error saving data:', error);
      }
    }
    return { success: false };
  });
};

export const saveTodoList = async (
  items: TodoItem[],
  mainState: MainState,
): Promise<{ success: boolean; listName?: string }> => {
  const filepath = mainState.mainSettings.filepath;
  if (filepath) {
    try {
      writeFileSync(filepath, JSON.stringify(items, null, 2), 'utf-8');
      console.log(`Data successfully saved to ${filepath}`);
      return { success: true, listName: filepath };
    } catch (error) {
      console.error('Error saving data:', error);
      return { success: false };
    }
  } else {
    return saveTodoListAs(items, mainState);
  }
};

const isTodoItemArray = (obj: unknown): obj is TodoItem[] => {
  return Array.isArray(obj) && obj.every((el) => isTodoItem(el));
};

export const loadTodoListFromPath = async (
  filepath: string,
): Promise<{ success: boolean; listName?: string; items?: TodoItem[] }> => {
  try {
    const raw = readFileSync(filepath, 'utf-8');
    const items = JSON.parse(raw);
    if (isTodoItemArray(items)) {
      console.log(`loaded ${items.length} items from ${filepath}`);
      return { success: true, listName: filepath, items: items };
    }
  } catch (error) {
    console.log(error);
  }
  return { success: false };
};

export const loadTodoList = async (
  mainState: MainState,
): Promise<{ success: boolean; items?: TodoItem[] }> => {
  const result = await dialog.showOpenDialog(mainState.mainWindow, {
    title: 'Open File',
    properties: ['openFile'],
    filters: [{ name: 'Tahi files', extensions: ['tahi'] }],
  });
  if (result.canceled || result.filePaths.length === 0) {
    return { success: false };
  }
  const filepath = result.filePaths[0];
  const answer = await loadTodoListFromPath(filepath);
  if (answer.success) {
    mainState.mainSettings.filepath = filepath;
  }
  return answer;
};
