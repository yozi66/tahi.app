import { TodoItem } from '@common/types/TodoItem';
import { AnyChange } from '@common/types/AnyChange';

export class TodoList {
  constructor(
    public items: TodoItem[] = [],
    public saved: boolean = false,
  ) {}
}

export const deleteItems = (todoList: TodoList, ids: number[]): AnyChange[] => {
  console.log(`Main: Deleting item(s) with id(s): ${ids.join(', ')}`);
  const deletedIds = new Set(ids);
  todoList.items = todoList.items.filter((item) => !deletedIds.has(item.id));
  todoList.saved = false;
  return []; // return empty array as no further changes to propagate
};
