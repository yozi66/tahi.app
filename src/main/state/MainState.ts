// runtime state of the app
import { BrowserWindow } from 'electron';
import { AnyChange } from '@common/types/AnyChange';
import { TodoList } from '@main/state/TodoList';

export type MainSettings = {
  filepath?: string;
};

export const isMainSettings = (obj: unknown): boolean => {
  return (
    typeof obj === 'object' && obj !== null && typeof (obj as MainSettings).filepath === 'string'
  );
};

export class MainState {
  constructor(
    private _mainWindow: BrowserWindow,
    private _mainList: TodoList,
    private _mainSettings: MainSettings,
  ) {}
  get mainWindow(): BrowserWindow {
    return this._mainWindow;
  }
  get mainList(): TodoList {
    return this._mainList;
  }
  get mainSettings(): MainSettings {
    return this._mainSettings;
  }
}

export const applyChange = (state: MainState, change: AnyChange): AnyChange[] => {
  switch (change.type) {
    case 'deleteItems':
      return state.mainList.deleteItems(change.ids);
    default:
      console.warn(`Unknown change type: ${change.type}`);
      return [];
  }
};
