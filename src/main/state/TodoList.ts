import { TodoItem } from '@common/types/TodoItem';
import { AnyChange } from '@common/types/AnyChange';
import { applyAddItems, applyDeleteItems, applyUpdateItem } from '@common/util/ApplyUtils';

export class TodoList {
  constructor(
    private _items: TodoItem[] = [],
    private _saved: boolean = false,
  ) {}
  get saved(): boolean {
    return this._saved;
  }
  set saved(isSaved: boolean) {
    this._saved = isSaved;
  }
  get items(): ReadonlyArray<TodoItem> {
    return this._items;
  }
  setAllItems(newItems: TodoItem[], options: { saved: boolean }): void {
    this._items = newItems;
    this._saved = options.saved;
  }
  deleteItems(ids: number[]): { undo: AnyChange | undefined; effects: AnyChange[] } {
    const { removed } = applyDeleteItems(this._items, ids);
    if (removed.length === 0) {
      console.log('No items found to delete');
      return { undo: undefined, effects: [] };
    }
    const undoChange: AnyChange = {
      type: 'addItems',
      items: removed,
    };
    this._saved = false;
    return { undo: undoChange, effects: [] };
  }
  addItems(itemsWithIndex: { item: TodoItem; index: number }[]): {
    undo: AnyChange | undefined;
    effects: AnyChange[];
  } {
    if (itemsWithIndex.length === 0) {
      console.log('No items provided to add');
      return { undo: undefined, effects: [] };
    }
    applyAddItems(this._items, itemsWithIndex);
    this._saved = false;
    const undoChange: AnyChange = {
      type: 'deleteItems',
      ids: itemsWithIndex.map(({ item }) => item.id),
    };
    return { undo: undoChange, effects: [] };
  }
  updateItem(id: number, newData: Partial<TodoItem>): {
    undo: AnyChange | undefined;
    effects: AnyChange[];
  } {
    const { previous } = applyUpdateItem(this._items, id, newData);
    if (!previous) {
      // nothing changed or item not found
      return { undo: undefined, effects: [] };
    }
    this._saved = false;
    const undoChange: AnyChange = {
      type: 'updateItem',
      id,
      newData: previous,
    };
    return { undo: undoChange, effects: [] };
  }
}
