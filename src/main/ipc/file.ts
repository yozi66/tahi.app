import { dialog } from 'electron';
import { TodoItem } from '@common/types/TodoItem';
import { MainState } from '@main/data/mainState';
import { writeFileSync } from 'fs';

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
        mainState.filepath = result.filePath;
        return { success: true };
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
): Promise<{ success: boolean }> => {
  if (mainState.filepath) {
    try {
      writeFileSync(mainState.filepath, JSON.stringify(items, null, 2), 'utf-8');
      console.log(`Data successfully saved to ${mainState.filepath}`);
      return { success: true };
    } catch (error) {
      console.error('Error saving data:', error);
      return { success: false };
    }
  } else {
    return saveTodoListAs(items, mainState);
  }
};
