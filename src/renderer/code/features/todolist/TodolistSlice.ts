import { createAppSlice } from '@renderer/app/createAppSlice';
import { TodoItem } from '@common/types/TodoItem';
import { Draft } from 'immer';
import { PayloadAction } from '@reduxjs/toolkit';
import { AnyChange } from '@common/types/AnyChange';

// State of the todolist feature

export type TodolistSlice = {
  selectedItemId?: number;
  selectedItemIndex?: number;
  editingTitle?: boolean;
  listName: string;
  todoItems: TodoItem[];
  nextId: number;
  saved?: boolean;
  status?: 'idle' | 'loading' | 'saving' | 'failed' | 'synching';
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
  nextId: 1,
  saved: true,
  status: 'idle',
};

const loadItems = (state: TodolistSlice, listName: string, items: TodoItem[]): void => {
  state.listName = listName;
  state.todoItems = items;
  if (items.length > 0) {
    state.selectedItemId = items[0].id;
    state.selectedItemIndex = 0;
    state.nextId = Math.max(...items.map((item) => item.id)) + 1;
  } else {
    state.selectedItemId = undefined;
    state.selectedItemIndex = undefined;
    state.nextId = 1;
  }
  state.saved = true;
  document.title = listName;
  console.log(`Loaded ${items.length} items from ${listName}`);
};

const applyChanges = (state: Draft<TodolistSlice>, { payload }: PayloadAction<AnyChange[]>) => {
  state.status = 'idle';
  console.log(`Applying ${payload.length} changes`);
  for (const change of payload) {
    switch (change.type) {
      case 'addItems': {
        const itemsWithIndex = change.items;
        // sort by index to insert in correct order
        itemsWithIndex.sort((a, b) => a.index - b.index);
        for (const { item, index } of itemsWithIndex) {
          if (index < 0 || index > state.todoItems.length) {
            console.warn(
              `Index ${index} out of bounds, appending item with id ${item.id} at the end`,
            );
            state.todoItems.push(item);
          } else {
            state.todoItems.splice(index, 0, item);
          }
          if (item.id >= state.nextId) {
            state.nextId = item.id + 1;
          }
        }
        state.saved = false;
        break;
      }
      case 'deleteItems': {
        const idsToDelete = new Set(change.ids);
        state.todoItems = state.todoItems.filter((item) => !idsToDelete.has(item.id));
        if (state.selectedItemId !== undefined && idsToDelete.has(state.selectedItemId)) {
          // Selected item was deleted, update selection
          if (state.todoItems.length > 0) {
            state.selectedItemIndex = Math.min(
              state.selectedItemIndex ?? 0,
              state.todoItems.length - 1,
            );
            state.selectedItemId = state.todoItems[state.selectedItemIndex].id;
          } else {
            state.selectedItemId = undefined;
            state.selectedItemIndex = undefined;
          }
          state.editingTitle = false;
        } else if (state.selectedItemId !== undefined) {
          // Update selected item index based on current selected item ID
          state.selectedItemIndex = computeItemIndex(state.todoItems, state.selectedItemId);
        }
        state.saved = false;
        break;
      }
      // Exhaustiveness check (compile-time)
      default: {
        const _exhaustiveCheck: never = change;
        return _exhaustiveCheck;
      }
    }
  }
};

export const todolistSlice = createAppSlice({
  name: 'todolist',
  initialState, // Initial state
  reducers: (create) => ({
    deleteRow: create.asyncThunk(
      async (payload: number | undefined) => {
        if (payload != undefined) {
          console.log(`Sending deleteItems ${payload}`);
          const result = await window.api.applyChange({
            type: 'deleteItems',
            ids: [payload],
          });
          return result; // AnyChange[] - further changes to apply
        }
        console.log('No row selected to delete');
        return []; // No changes to apply
      },
      {
        pending: (state) => {
          state.status = 'synching';
          if (state.selectedItemIndex != undefined && state.selectedItemId != undefined) {
            // Update local state immediately for responsiveness
            console.log(`Deleting local item ${state.selectedItemId}`);
            state.todoItems.splice(state.selectedItemIndex, 1);
            if (state.todoItems.length > 0) {
              if (state.selectedItemIndex >= state.todoItems.length) {
                state.selectedItemIndex = state.todoItems.length - 1;
              }
              state.selectedItemId = state.todoItems[state.selectedItemIndex].id;
            } else {
              state.selectedItemIndex = undefined;
              state.selectedItemId = undefined;
            }
            state.editingTitle = false;
            state.saved = false;
          }
        },
        fulfilled: (state, action) => {
          state.status = 'idle';
          console.log(`Further changes to apply: ${action.payload.length}`);
        },
        rejected: (state) => {
          state.status = 'failed';
          console.error('Delete failed');
        },
      },
    ),
    insertRowBelow: create.reducer((state) => {
      const newItem = { id: state.nextId++, title: '', done: false, comments: '' };
      const atIndex =
        state.selectedItemIndex === undefined || state.todoItems.length === 0
          ? state.todoItems.length
          : state.selectedItemIndex + 1;
      state.todoItems.splice(atIndex, 0, newItem);
      state.selectedItemIndex = atIndex;
      state.selectedItemId = newItem.id;
      state.editingTitle = true;
      state.saved = false;
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
      async (payload: { items: TodoItem[]; saveAs?: boolean }) => {
        const result = await window.api.save(payload.items, payload.saveAs);
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
            document.title = action.payload.listName;
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
    undo: create.asyncThunk(
      async () => {
        const result = await window.api.undo();
        return result; // AnyChange[] - changes to apply
      },
      {
        pending: (state) => {
          state.status = 'synching';
          console.log('Undoing...');
        },
        fulfilled: applyChanges,
        rejected: (state) => {
          state.status = 'failed';
          console.error('Undo failed');
        },
      },
    ),
    redo: create.asyncThunk(
      async () => {
        const result = await window.api.redo();
        return result; // AnyChange[] - changes to apply
      },
      {
        pending: (state) => {
          state.status = 'synching';
          console.log('Redoing...');
        },
        fulfilled: applyChanges,
        rejected: (state) => {
          state.status = 'failed';
          console.error('Redo failed');
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
  deleteRow,
  insertRowBelow,
  setSelectedItemId,
  setEditingTitle,
  setSelectedTitle,
  setSelectedComments,
  toggleDone,
  undo,
  redo,
} = todolistSlice.actions;

export const { getSelectedItemId, getSelectedItemIndex, getEditingTitle, getItems } =
  todolistSlice.selectors;
export const { load, save } = todolistSlice.actions;
