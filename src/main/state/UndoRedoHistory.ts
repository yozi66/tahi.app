import { AnyChange } from '@common/types/AnyChange';

export type ChangeExecutor = (change: AnyChange) => { undo?: AnyChange; effects: AnyChange[] };

export class UndoRedoHistory {
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

  canUndo(): boolean {
    return this._past.length > 0;
  }

  canRedo(): boolean {
    return this._future.length > 0;
  }

  reset(): void {
    console.log('Resetting undo/redo history');
    this._past = [];
    this._future = [];
  }
}
