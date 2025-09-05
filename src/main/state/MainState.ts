// runtime state of the app
import { BrowserWindow } from 'electron';
import { AnyChange } from '@common/types/AnyChange';
import { TodoList, deleteItems } from '@main/state/TodoList';

export type MainSettings = {
  filepath?: string;
};

export const isMainSettings = (obj: unknown): boolean => {
  return (
    typeof obj === 'object' && obj !== null && typeof (obj as MainSettings).filepath === 'string'
  );
};

export type MainState = {
  mainWindow: BrowserWindow;
  mainList: TodoList;
  mainSettings: MainSettings;
};

export const applyChange = (state: MainState, change: AnyChange): AnyChange[] => {
  switch (change.type) {
    case 'deleteItems':
      return deleteItems(state.mainList, change.ids);
    default:
      console.warn(`Unknown change type: ${change.type}`);
      return [];
  }
};
