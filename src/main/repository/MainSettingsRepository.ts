import { app } from 'electron';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

import { MainSettings, isMainSettings } from '@main/state/MainState';

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
