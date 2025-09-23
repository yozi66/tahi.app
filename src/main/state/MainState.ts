// runtime state of the app
import { BrowserWindow } from 'electron';
import { AnyChange } from '@common/types/AnyChange';
import { TodoList } from '@main/state/TodoList';
import { TodoItem } from '@common/types/TodoItem';
import { ChangeDistributor } from '@main/state/ChangeDistributor';
import { ChangeExecutor, UndoRedoHistory } from '@main/state/UndoRedoHistory';

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
  ) {
    this._registerWindow(this._mainWindow);
  }
  private _history = new UndoRedoHistory();
  private _changeDistributor = new ChangeDistributor();
  private _windows = new Map<number, BrowserWindow>();
  private _currentUndoRedoStatusChange(): AnyChange {
    return {
      type: 'setUndoRedoStatus',
      canUndo: this._history.canUndo(),
      canRedo: this._history.canRedo(),
    };
  }

  private _registerWindow(window: BrowserWindow): void {
    const windowId = window.id;
    this._windows.set(windowId, window);
    this._changeDistributor.register(windowId);
    window.on('closed', () => {
      this.removeWindow(windowId);
    });
  }

  private _dispatchQueuedChanges(): void {
    const toRemove: number[] = [];
    for (const [windowId, window] of this._windows.entries()) {
      if (window.isDestroyed()) {
        toRemove.push(windowId);
        continue;
      }
      const pending = this._changeDistributor.drain(windowId);
      if (pending.length === 0) {
        continue;
      }
      console.log(`Dispatching ${pending.length} changes to window ${windowId}`);
      window.webContents.send('push-change', pending);
    }
    if (toRemove.length > 0) {
      for (const windowId of toRemove) {
        this._windows.delete(windowId);
        this._changeDistributor.unregister(windowId);
      }
    }
  }

  private _queueAndDispatch(changes: AnyChange[]): void {
    console.log(`queueAndDispatch: ${changes.length} changes`);
    if (changes.length === 0) {
      return;
    }
    this._changeDistributor.enqueueForObservers(changes);
    this._dispatchQueuedChanges();
  }

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
    if (change.type === 'setUndoRedoStatus') {
      throw new Error('setUndoRedoStatus changes are not executable in main state');
    }
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
  applyChange(change: AnyChange): void {
    this._queueAndDispatch([change]);
    const effects = this._history.apply(change, this._exec);
    const statusChange = this._currentUndoRedoStatusChange();
    const result = [...effects, statusChange];
    this._queueAndDispatch(result);
  }
  undo(): void {
    const changes = this._history.undo(this._exec);
    const statusChange = this._currentUndoRedoStatusChange();
    this._queueAndDispatch([...changes, statusChange]);
  }
  redo(): void {
    const changes = this._history.redo(this._exec);
    const statusChange = this._currentUndoRedoStatusChange();
    this._queueAndDispatch([...changes, statusChange]);
  }

  addWindow(window: BrowserWindow): void {
    if (this._windows.has(window.id)) {
      return;
    }
    this._registerWindow(window);
  }

  removeWindow(windowId: number): void {
    this._windows.delete(windowId);
    this._changeDistributor.unregister(windowId);
  }
}
