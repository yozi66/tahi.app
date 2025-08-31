// runtime state of the app
import { BrowserWindow } from 'electron';
import { TodoList } from '@main/state/TodoList';

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
