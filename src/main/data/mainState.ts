// runtime state of the app
import { app, BrowserWindow } from 'electron';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

export type FileInfo = {
  shortname: string;
  filepath?: string;
};

export type MainSettings = {
  todoFiles: Record<string, FileInfo>;
};

export type MainState = {
  mainWindow: BrowserWindow;
  mainSettings: MainSettings;
};

const settingsPath = path.join(app.getPath('userData'), 'tahi-settings.json');

export const readMainSettings = (): MainSettings => {
  const defaultFileInfo = { '1': { shortname: 'sampleList' } };
  try {
    const raw = readFileSync(settingsPath, 'utf-8');
    const mainSettings = JSON.parse(raw);
    if (!mainSettings.todoFiles['1']) {
      mainSettings.todoFiles['1'] = defaultFileInfo['1'];
    }
    return mainSettings;
  } catch (error) {
    console.log(error);
    return { todoFiles: defaultFileInfo };
  }
};

export const saveMainSettings = (mainSettings: MainSettings): void => {
  try {
    writeFileSync(settingsPath, JSON.stringify(mainSettings, null, 2));
  } catch (error) {
    console.log(error);
  }
};
