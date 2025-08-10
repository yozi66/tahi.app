import { TodoItem } from './TodoItem';

export type TahiState = {
  selectedItemId?: number;
  selectedItemIndex?: number;
  todoItems: TodoItem[];
};

export const computeSelectedItemIndex = (draftState: TahiState): number => {
  if (draftState.selectedItemId === undefined) {
    return 0;
  } else {
    return draftState.todoItems.findIndex((todo) => todo.id === draftState.selectedItemId);
  }
};
