import { TodoItem } from '@common/types/TodoItem';
import { AnyChange } from '@common/types/AnyChange';
import { applyAddItems, applyDeleteItems } from '@common/util/ApplyUtils';

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
    const { items, removed } = applyDeleteItems(this._items, ids);
    if (removed.length === 0) {
      console.log('No items found to delete');
      return { undo: undefined, effects: [] };
    }
    const undoChange: AnyChange = {
      type: 'addItems',
      items: removed,
    };
    // perform the deletion
    console.log(`Deleting item(s) with id(s): ${ids.join(', ')}`);
    this._items = items;
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
    this._items = applyAddItems(this._items, itemsWithIndex).items;
    this._saved = false;
    const undoChange: AnyChange = {
      type: 'deleteItems',
      ids: itemsWithIndex.map(({ item }) => item.id),
    };
    return { undo: undoChange, effects: [] };
  }
}
