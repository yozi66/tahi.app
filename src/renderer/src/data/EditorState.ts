import { TodoItem } from './TodoItem';
import { sampleState } from './TodoData';

export type EditorState = {
  selectedItemId?: number;
  selectedItemIndex?: number;
  todoItems: TodoItem[];
};

export const computeItemIndex = (todoItems: TodoItem[], target: TodoItem): number => {
  return todoItems.findIndex((item) => item.id === target.id);
};

export const createEditorSlice = (): EditorState => sampleState;
