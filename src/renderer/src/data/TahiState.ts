import { TodoItem } from './TodoItem';

export type TahiState = {
  selectedItemId?: number;
  selectedItemIndex?: number;
  todoItems: TodoItem[];
};

export const computeItemIndex = (todoItems: TodoItem[], target: TodoItem): number => {
  return todoItems.findIndex((item) => item.id === target.id);
};
