import { createAppSlice } from '@renderer/app/createAppSlice';
import { TodoItem } from '@common/types/TodoItem';
import { Draft } from 'immer';
import { PayloadAction } from '@reduxjs/toolkit';
import { AnyChange } from '@common/types/AnyChange';
import { applyAddItems, applyDeleteItems } from '@common/util/ApplyUtils';

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

// Applies a single change to the state. Optionally focuses selection on first added item.
const applySingleChange = (
  state: Draft<TodolistSlice>,
  change: AnyChange,
  opts?: { focusOnFirstAdded?: boolean },
): void => {
  switch (change.type) {
    case 'addItems': {
      const itemsWithIndex = change.items;
      applyAddItems(state.todoItems, itemsWithIndex);
      // update nextId to be higher than any new item id
      const maxNewId = itemsWithIndex.reduce((m, { item }) => Math.max(m, item.id), 0);
      if (maxNewId >= state.nextId) {
        state.nextId = maxNewId + 1;
      }
      // Optionally focus selection on first added item
      if (opts?.focusOnFirstAdded && itemsWithIndex.length > 0) {
        const firstId = itemsWithIndex[0].item.id;
        state.selectedItemId = firstId;
        state.selectedItemIndex = computeItemIndex(state.todoItems, firstId);
        state.editingTitle = true;
      }
      state.saved = false;
      break;
    }
    case 'deleteItems': {
      applyDeleteItems(state.todoItems, change.ids);
      const idsToDelete = new Set(change.ids);
      const selectedWasDeleted =
        state.selectedItemId !== undefined && idsToDelete.has(state.selectedItemId);
      if (selectedWasDeleted) {
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
    case 'updateItem': {
      const idx = state.todoItems.findIndex((it) => it.id === change.id);
      if (idx !== -1) {
        const item = state.todoItems[idx];
        const patch = change.newData;
        if (patch.title !== undefined) item.title = patch.title;
        if (patch.comments !== undefined) item.comments = patch.comments;
        if (patch.done !== undefined) item.done = patch.done;
        state.saved = false;
      }
      break;
    }
    default: {
      const _exhaustiveCheck: never = change;
      return _exhaustiveCheck;
    }
  }
};

const applyChanges = (
  state: Draft<TodolistSlice>,
  { payload }: PayloadAction<AnyChange[]>,
): void => {
  state.status = 'idle';
  console.log(`Applying ${payload.length} changes`);
  for (const change of payload) {
    applySingleChange(state, change, { focusOnFirstAdded: false });
  }
};

export const todolistSlice = createAppSlice({
  name: 'todolist',
  initialState, // Initial state
  reducers: (create) => ({
    sendAndApplyChange: create.asyncThunk(
      async (payload: AnyChange) => {
        const result = await window.api.applyChange(payload);
        return result; // AnyChange[] - further changes to apply
      },
      {
        pending: (state, action: { meta: { arg: AnyChange } }) => {
          state.status = 'synching';
          const change = action.meta.arg;
          applySingleChange(state, change, { focusOnFirstAdded: true });
        },
        fulfilled: applyChanges,
        rejected: (state) => {
          state.status = 'failed';
          console.error('Change failed');
        },
      },
    ),
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
    updateItem: create.asyncThunk(
      async (payload: { id: number; newData: Partial<TodoItem> }) => {
        const change: AnyChange = {
          type: 'updateItem',
          id: payload.id,
          newData: payload.newData,
        };
        const result = await window.api.applyChange(change);
        return result; // AnyChange[] - further changes to apply
      },
      {
        pending: (state, action: { meta: { arg: { id: number; newData: Partial<TodoItem> } } }) => {
          state.status = 'synching';
          const { id, newData } = action.meta.arg;
          applySingleChange(
            state,
            { type: 'updateItem', id, newData },
            { focusOnFirstAdded: false },
          );
        },
        fulfilled: applyChanges,
        rejected: (state) => {
          state.status = 'failed';
          console.error('Change failed');
        },
      },
    ),
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
    getEditingTitle: (state) => state.editingTitle,
    getItems: (state) => state.todoItems,
    getNextId: (state) => state.nextId,
    getSelectedItemId: (state) => state.selectedItemId,
    getSelectedItemIndex: (state) => state.selectedItemIndex,
  },
});
export const {
  sendAndApplyChange,
  updateItem,
  setSelectedItemId,
  setEditingTitle,
  setSelectedComments,
  toggleDone,
  undo,
  redo,
} = todolistSlice.actions;

export const { getEditingTitle, getItems, getNextId, getSelectedItemId, getSelectedItemIndex } =
  todolistSlice.selectors;
export const { load, save } = todolistSlice.actions;
