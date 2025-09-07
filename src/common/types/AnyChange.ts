import { TodoItem } from './TodoItem';

interface Change {
  type: string;
}

export interface AddItemsChange extends Change {
  type: 'addItems';
  items: { item: TodoItem; index: number }[];
}

export interface DeleteItemsChange extends Change {
  type: 'deleteItems';
  ids: number[];
}

export interface UpdateItemChange extends Change {
  type: 'updateItem';
  id: number;
  newData: Partial<TodoItem>;
}

export type AnyChange = AddItemsChange | DeleteItemsChange | UpdateItemChange;
