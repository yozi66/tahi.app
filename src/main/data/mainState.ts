// runtime state of the app
import { app, BrowserWindow } from 'electron';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

export type MainSettings = {
  filepath?: string;
};

const isMainSettings = (obj: unknown): boolean => {
  return (
    typeof obj === 'object' && obj !== null && typeof (obj as MainSettings).filepath === 'string'
  );
};

export type MainState = {
  mainWindow: BrowserWindow;
  mainSettings: MainSettings;
};

const settingsPath = path.join(app.getPath('userData'), 'tahi-settings.json');

export const readMainSettings = (): MainSettings => {
  try {
    const raw = readFileSync(settingsPath, 'utf-8');
    const mainSettings = JSON.parse(raw);
    if (isMainSettings(mainSettings)) {
      return mainSettings;
    }
  } catch (error) {
    console.log(error);
  }
  return {};
};

export const saveMainSettings = (mainSettings: MainSettings): void => {
  try {
    writeFileSync(settingsPath, JSON.stringify(mainSettings, null, 2));
  } catch (error) {
    console.log(error);
  }
};
