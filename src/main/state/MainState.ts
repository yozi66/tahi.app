// runtime state of the app
import { BrowserWindow } from 'electron';
import { AnyChange } from '@common/types/AnyChange';
import { TodoList } from '@main/state/TodoList';
import { TodoItem } from '@common/types/TodoItem';

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
  private _past: AnyChange[] = [];
  private _future: AnyChange[] = [];

  get mainWindow(): BrowserWindow {
    return this._mainWindow;
  }
  get mainSettings(): MainSettings {
    return this._mainSettings;
  }
  get items(): ReadonlyArray<TodoItem> {
    return this._mainList.items;
  }
  setAllItems(newItems: TodoItem[], options: { saved: boolean }): void {
    this._mainList.setAllItems(newItems, options);
  }
  applyChange(change: AnyChange): AnyChange[] {
    switch (change.type) {
      case 'addItems': {
        const { undo, effects } = this._mainList.addItems(change.items);
        if (undo) {
          this._past.push(undo);
          this._future = []; // clear future on new action
        }
        return effects;
      }
      case 'deleteItems': {
        const { undo, effects } = this._mainList.deleteItems(change.ids);
        if (undo) {
          this._past.push(undo);
          this._future = []; // clear future on new action
        }
        return effects;
      }
      // Exhaustiveness check (compile-time)
      default: {
        const _exhaustiveCheck: never = change;
        return _exhaustiveCheck;
      }
    }
  }
  undo(): AnyChange[] {
    const lastChange = this._past.pop();
    if (!lastChange) {
      console.log('No actions to undo');
      return [];
    }
    console.log(`Undoing change: ${lastChange.type}`);
    switch (lastChange.type) {
      case 'deleteItems': {
        const { undo, effects } = this._mainList.deleteItems(lastChange.ids);
        if (undo) {
          this._future.push(undo);
        }
        return [lastChange, ...effects];
      }
      case 'addItems': {
        const { undo, effects } = this._mainList.addItems(lastChange.items);
        if (undo) {
          this._future.push(undo);
        }
        return [lastChange, ...effects];
      }
      // Exhaustiveness check (compile-time)
      default: {
        const _exhaustiveCheck: never = lastChange;
        return _exhaustiveCheck;
      }
    }
  }
  redo(): AnyChange[] {
    const nextChange = this._future.pop();
    if (!nextChange) {
      console.log('No actions to redo');
      return [];
    }
    console.log(`Redoing change: ${nextChange.type}`);
    switch (nextChange.type) {
      case 'deleteItems': {
        const { undo, effects } = this._mainList.deleteItems(nextChange.ids);
        if (undo) {
          this._past.push(undo);
        }
        return [nextChange, ...effects];
      }
      case 'addItems': {
        const { undo, effects } = this._mainList.addItems(nextChange.items);
        if (undo) {
          this._past.push(undo);
        }
        return [nextChange, ...effects];
      }
      // Exhaustiveness check (compile-time)
      default: {
        const _exhaustiveCheck: never = nextChange;
        return _exhaustiveCheck;
      }
    }
  }
}
