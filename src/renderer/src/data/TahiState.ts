import { TodoItem } from './TodoItem';
export class TahiState {
  private selectedItemId?: number;
  private selectedItemIndex?: number;
  private todoItems: TodoItem[];

  constructor(todoItems: TodoItem[], selectedItemIndex?: number) {
    this.todoItems = todoItems;
    this.selectedItemIndex = selectedItemIndex;
    this.selectedItemId =
      selectedItemIndex !== undefined ? todoItems[selectedItemIndex].id : undefined;
  }

  public deepCopy(): TahiState {
    return new TahiState(
      this.todoItems.map((item) => ({
        ...item,
        title: { ...item.title },
      })),
      this.selectedItemIndex,
    );
  }
  /**
   * Creates a shallow copy of the TahiState.
   * This method returns a new instance of TahiState with the same todoItems and selectedItemIndex.
   * The todoItems are not cloned, so changes to the items in the copied state will affect the original state.
   * This is useful for performance reasons when you don't need to modify the items.
   * Hint: use replaceItem to update an item.
   * @returns {TahiState} A new instance of TahiState with the same todoItems and selectedItemIndex.
   */
  public shallowCopy(): TahiState {
    return new TahiState([...this.todoItems], this.selectedItemIndex);
  }

  public getSelectedItem(): TodoItem | undefined {
    return this.selectedItemIndex !== undefined
      ? this.todoItems[this.selectedItemIndex]
      : undefined;
  }
  public getSelectedItemId(): number | undefined {
    return this.selectedItemId;
  }
  public getSelectedItemIndex(): number | undefined {
    return this.selectedItemIndex;
  }
  public getTodoItems(): TodoItem[] {
    return this.todoItems;
  }
  public replaceItem(index: number, newItem: TodoItem): void {
    this.todoItems[index] = newItem;
  }
  public setSelectedItemId(id: number): void {
    this.selectedItemId = id;
    this.selectedItemIndex = this.todoItems.findIndex((todo) => todo.id === id);
  }
}
