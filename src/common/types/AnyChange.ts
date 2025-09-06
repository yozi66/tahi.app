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

export type AnyChange = AddItemsChange | DeleteItemsChange;
