import { createAppSlice } from '@renderer/app/createAppSlice';
import { TodoItem } from '@common/types/TodoItem';

export type TodolistSlice = {
  selectedItemId?: number;
  selectedItemIndex?: number;
  editingTitle?: boolean;
  listName: string;
  todoItems: TodoItem[];
  saved?: boolean;
  status?: 'idle' | 'loading' | 'saving' | 'failed';
};

const computeItemIndex = (todoItems: TodoItem[], id: number): number => {
  return todoItems.findIndex((item) => item.id === id);
};

const initialState: TodolistSlice = {
  selectedItemId: 1,
  selectedItemIndex: 0,
  editingTitle: false,
  listName: '(new TodoList)',
  todoItems: [],
  saved: true,
  status: 'idle',
};

const loadItems = (state: TodolistSlice, listName: string, items: TodoItem[]): void => {
  state.listName = listName;
  state.todoItems = items;
  if (items.length > 0) {
    state.selectedItemId = items[0].id;
    state.selectedItemIndex = 0;
  } else {
    state.selectedItemId = undefined;
    state.selectedItemIndex = undefined;
  }
  state.saved = true;
  console.log(`Loaded ${items.length} items from ${listName}`);
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
    setTodoItems: create.reducer(
      (state, action: { payload: { listName: string; items: TodoItem[] } }) => {
        loadItems(state, action.payload.listName, action.payload.items);
      },
    ),
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
    load: create.asyncThunk(
      async () => {
        const result = await window.api.load();
        return result;
      },
      {
        pending: (state) => {
          state.status = 'loading';
          console.log('Loading...');
        },
        fulfilled: (state, action) => {
          if (action.payload.success) {
            state.status = 'idle';
            loadItems(state, action.payload.listName, action.payload.items);
          } else {
            state.status = 'failed';
            console.error('Save failed');
          }
        },
        rejected: (state) => {
          state.status = 'failed';
          console.error('Load failed');
        },
      },
    ),
    save: create.asyncThunk(
      async (payload: TodoItem[]) => {
        const result = await window.api.save(payload);
        return result; // { success: boolean, listName?: string }
      },
      {
        pending: (state) => {
          state.status = 'saving';
          console.log('Saving...');
        },
        fulfilled: (state, action) => {
          if (action.payload.success && action.payload.listName !== undefined) {
            state.status = 'idle';
            state.saved = true;
            state.listName = action.payload.listName;
            console.log(`Saved to ${action.payload.listName}`);
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
export const { load, save } = todolistSlice.actions;
