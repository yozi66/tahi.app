import { TodoItem } from './TodoItem';
import { sampleListState } from './sampleListState';

export type TodolistSlice = {
  selectedItemId?: number;
  selectedItemIndex?: number;
  editingTitle?: boolean;
  todoItems: TodoItem[];
};

export const computeItemIndex = (todoItems: TodoItem[], target: TodoItem): number => {
  return todoItems.findIndex((item) => item.id === target.id);
};

export const createEditorSlice = (): TodolistSlice => sampleListState;
