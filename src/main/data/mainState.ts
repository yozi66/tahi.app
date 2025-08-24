// runtime state of the app
import { BrowserWindow } from 'electron';

export type MainState = {
  mainWindow: BrowserWindow;
  filename?: string;
};
