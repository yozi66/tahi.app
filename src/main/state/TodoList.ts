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
  get itemCount(): number {
    return this._items.length;
  }
  get items(): ReadonlyArray<TodoItem> {
    return this._items;
  }
  setAllItems(newItems: TodoItem[], options: { saved: boolean }): void {
    this._items = newItems;
    this._saved = options.saved;
  }
  deleteItems(ids: number[]): AnyChange[] {
    console.log(`Deleting item(s) with id(s): ${ids.join(', ')}`);
    const deletedIds = new Set(ids);
    this._items = this._items.filter((item) => !deletedIds.has(item.id));
    this._saved = false;
    return []; // return empty array as no further changes to propagate
  }
}
