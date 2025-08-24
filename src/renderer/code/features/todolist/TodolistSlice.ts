import { createAppSlice } from '@renderer/app/createAppSlice';
import { TodoItem } from '@common/types/TodoItem';

export type TodolistSlice = {
  selectedItemId?: number;
  selectedItemIndex?: number;
  editingTitle?: boolean;
  todoItems: TodoItem[];
  saved?: boolean;
  status?: 'idle' | 'saving' | 'failed';
};

const computeItemIndex = (todoItems: TodoItem[], id: number): number => {
  return todoItems.findIndex((item) => item.id === id);
};

const initialState: TodolistSlice = {
  selectedItemId: 1,
  selectedItemIndex: 0,
  editingTitle: false,
  todoItems: [],
  saved: true,
  status: 'idle',
};

export const todolistSlice = createAppSlice({
  name: 'todolist',
  initialState, // Initial state
  reducers: (create) => ({
    setEditingTitle: create.reducer((state, action: { payload: boolean }) => {
      state.editingTitle = action.payload;
    }),
    setSelectedItemId: create.reducer((state, action: { payload: number }) => {
      state.selectedItemId = action.payload;
      state.selectedItemIndex = computeItemIndex(state.todoItems, action.payload);
    }),
    setSelectedTitle: create.reducer((state, action: { payload: string }) => {
      const selectedItemIndex = state.selectedItemIndex;
      if (selectedItemIndex !== undefined) {
        state.todoItems[selectedItemIndex].title = action.payload;
        state.saved = false;
      }
    }),
    setSelectedComments: create.reducer((state, action: { payload: string }) => {
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
      state.saved = false;
    }),
    setTodoItems: create.reducer((state, action: { payload: TodoItem[] }) => {
      state.todoItems = action.payload;
      if (action.payload.length > 0) {
        state.selectedItemId = action.payload[0].id;
        state.selectedItemIndex = 0;
      } else {
        state.selectedItemId = undefined;
        state.selectedItemIndex = undefined;
      }
      state.saved = true;
    }),
    toggleDone: create.reducer((state, action: { payload: number }) => {
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
        state.saved = false;
      }
    }),
    save: create.asyncThunk(
      async (payload: TodoItem[]) => {
        const result = await window.api.save(payload);
        return result; // { success: boolean }
      },
      {
        pending: (state) => {
          state.status = 'saving';
          console.log('Saving...');
        },
        fulfilled: (state, action) => {
          if (action.payload.success) {
            state.status = 'idle';
            state.saved = true;
            console.log('Save successful');
          } else {
            state.status = 'failed';
            console.error('Save failed');
          }
        },
        rejected: (state) => {
          state.status = 'failed';
          console.error('Save failed');
        },
      },
    ),
  }),
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
export const { save } = todolistSlice.actions;
