import { TodoItem } from '@common/types/TodoItem';
import { AnyChange } from '@common/types/AnyChange';

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
    const deletedIds = new Set(ids);
    // collect the items to be deleted for undo
    const itemsToDelete: { item: TodoItem; index: number }[] = this._items
      .map((item, index) => ({ item, index }))
      .filter((pair) => deletedIds.has(pair.item.id));
    if (itemsToDelete.length === 0) {
      console.log('No items found to delete');
      return { undo: undefined, effects: [] };
    }
    const undoChange: AnyChange = {
      type: 'addItems',
      items: itemsToDelete,
    };
    // perform the deletion
    console.log(`Deleting item(s) with id(s): ${ids.join(', ')}`);
    this._items = this._items.filter((item) => !deletedIds.has(item.id));
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
    // sort by index to insert in correct order
    itemsWithIndex.sort((a, b) => a.index - b.index);
    for (const { item, index } of itemsWithIndex) {
      if (index < 0 || index > this._items.length) {
        console.warn(`Index ${index} out of bounds, appending item with id ${item.id} at the end`);
        this._items.push(item);
      } else {
        this._items.splice(index, 0, item);
      }
    }
    this._saved = false;
    const undoChange: AnyChange = {
      type: 'deleteItems',
      ids: itemsWithIndex.map(({ item }) => item.id),
    };
    return { undo: undoChange, effects: [] };
  }
}
