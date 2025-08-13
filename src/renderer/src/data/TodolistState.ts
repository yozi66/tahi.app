import { TodoItem } from './TodoItem';
import { sampleListState } from './sampleListState';

export type TodolistState = {
  selectedItemId?: number;
  selectedItemIndex?: number;
  todoItems: TodoItem[];
};

export const computeItemIndex = (todoItems: TodoItem[], target: TodoItem): number => {
  return todoItems.findIndex((item) => item.id === target.id);
};

export const createEditorSlice = (): TodolistState => sampleListState;
