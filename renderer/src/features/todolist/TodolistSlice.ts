import { createAppSlice } from '@/app/createAppSlice';
import { TodoItem } from '@/data/TodoItem';
import { sampleList } from '@/data/sampleListState';

export type TodolistSlice = {
  selectedItemId?: number;
  selectedItemIndex?: number;
  editingTitle?: boolean;
  todoItems: TodoItem[];
};

const computeItemIndex = (todoItems: TodoItem[], id: number): number => {
  return todoItems.findIndex((item) => item.id === id);
};

const initialState: TodolistSlice = {
  selectedItemId: 1,
  selectedItemIndex: 0,
  editingTitle: false,
  todoItems: sampleList,
};

export const todolistSlice = createAppSlice({
  name: 'todolist',
  initialState, // Initial state
  reducers: {
    setSelectedItemId: (state, action) => {
      state.selectedItemId = action.payload;
      state.selectedItemIndex = computeItemIndex(state.todoItems, action.payload);
    },
    setEditingTitle: (state, action) => {
      state.editingTitle = action.payload;
    },
    setSelectedTitle: (state, action) => {
      const selectedItemIndex = state.selectedItemIndex;
      if (selectedItemIndex !== undefined) {
        state.todoItems[selectedItemIndex].title = action.payload;
      }
    },
    setSelectedComments: (state, action) => {
      const selectedItemIndex = state.selectedItemIndex;
      if (selectedItemIndex === undefined) {
        return;
      }
      const selectedItem = state.todoItems[selectedItemIndex];
      if (selectedItem === undefined) {
        return;
      }
      selectedItem.comments = action.payload;
      state.editingTitle = false; // Exit title edit mode when editing comments
    },
    toggleDone: (state, action) => {
      if (state.selectedItemId !== action.payload) {
        state.selectedItemId = action.payload;
        // Update the selected item index based on the new selected item ID
        state.selectedItemIndex = computeItemIndex(state.todoItems, action.payload);
      }
      const selectedItemIndex = state.selectedItemIndex;
      state.editingTitle = false;
      if (selectedItemIndex !== undefined) {
        // Toggle the done status of the selected item
        const item = state.todoItems[selectedItemIndex];
        if (item) {
          item.done = !item.done;
        }
      }
    },
  },
  selectors: {
    getSelectedItemId: (state) => state.selectedItemId,
    getSelectedItemIndex: (state) => state.selectedItemIndex,
    getEditingTitle: (state) => state.editingTitle,
    getItems: (state) => state.todoItems,
  },
});

export const {
  setSelectedItemId,
  setEditingTitle,
  setSelectedTitle,
  setSelectedComments,
  toggleDone,
} = todolistSlice.actions;

export const { getSelectedItemId, getSelectedItemIndex, getEditingTitle, getItems } =
  todolistSlice.selectors;
