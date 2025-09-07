// runtime state of the app
import { BrowserWindow } from 'electron';
import { AnyChange } from '@common/types/AnyChange';
import { TodoList } from '@main/state/TodoList';
import { TodoItem } from '@common/types/TodoItem';

type ChangeExecutor = (change: AnyChange) => { undo?: AnyChange; effects: AnyChange[] };

class UndoRedoHistory {
  private _past: AnyChange[] = [];
  private _future: AnyChange[] = [];

  apply(change: AnyChange, exec: ChangeExecutor): AnyChange[] {
    const { undo, effects } = exec(change);
    if (undo) {
      this._past.push(undo);
      this._future.length = 0;
    }
    return effects;
  }

  undo(exec: ChangeExecutor): AnyChange[] {
    const last = this._past.pop();
    if (!last) {
      return [];
    }
    const { undo, effects } = exec(last);
    if (undo) {
      this._future.push(undo);
    }
    return [last, ...effects];
  }

  redo(exec: ChangeExecutor): AnyChange[] {
    const next = this._future.pop();
    if (!next) {
      return [];
    }
    const { undo, effects } = exec(next);
    if (undo) {
      this._past.push(undo);
    }
    return [next, ...effects];
  }

  reset(): void {
    console.log('Resetting undo/redo history');
    this._past = [];
    this._future = [];
  }
}

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
  private _history = new UndoRedoHistory();

  get mainWindow(): BrowserWindow {
    return this._mainWindow;
  }
  get mainSettings(): MainSettings {
    return this._mainSettings;
  }
  get items(): ReadonlyArray<TodoItem> {
    return this._mainList.items;
  }
  setAllItems(newItems: TodoItem[], options: { saved: boolean; resetHistory: boolean }): void {
    this._mainList.setAllItems(newItems, options);
    if (options.resetHistory) {
      this._history.reset();
    }
  }
  private _exec: ChangeExecutor = (change: AnyChange) => {
    switch (change.type) {
      case 'addItems':
        return this._mainList.addItems(change.items);
      case 'deleteItems':
        return this._mainList.deleteItems(change.ids);
      case 'updateItem':
        return this._mainList.updateItem(change.id, change.newData);
      default: {
        const _exhaustiveCheck: never = change;
        return _exhaustiveCheck;
      }
    }
  };
  applyChange(change: AnyChange): AnyChange[] {
    return this._history.apply(change, this._exec);
  }
  undo(): AnyChange[] {
    return this._history.undo(this._exec);
  }
  redo(): AnyChange[] {
    return this._history.redo(this._exec);
  }
}
