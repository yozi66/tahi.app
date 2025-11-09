import { createAppSlice } from '@renderer/app/createAppSlice';
import { TodoItem } from '@common/types/TodoItem';
import type { Draft } from '@reduxjs/toolkit';
import { AnyChange } from '@common/types/AnyChange';
import { applyAddItems, applyDeleteItems, applyMoveItems } from '@common/util/ApplyUtils';

export type TodolistSlice = {
  firstSelectedItemId?: number;
  topSelectedItemId?: number;
  selectedItemIds: number[];
  firstSelectedItemIndex?: number;
  topSelectedItemIndex?: number;
  selectedItemIndexes: number[];
  editingTitle?: boolean;
  listName: string;
  todoItems: TodoItem[];
  nextId: number;
  saved?: boolean;
  status?: 'idle' | 'loading' | 'saving' | 'failed' | 'synching';
  canUndo: boolean;
  canRedo: boolean;
  pendingFocusId?: number;
};

const computeItemIndex = (todoItems: TodoItem[], id: number): number => {
  return todoItems.findIndex((item) => item.id === id);
};

const applySelection = (state: Draft<TodolistSlice>, ids: number[]): void => {
  const uniqueIds: number[] = [];
  const uniqueSet = new Set<number>();
  const indexes: number[] = [];
  let topIndex = Number.POSITIVE_INFINITY;
  let topId: number | undefined;

  for (const id of ids) {
    if (uniqueSet.has(id)) continue;
    const idx = computeItemIndex(state.todoItems, id);
    if (idx === -1) continue;
    uniqueSet.add(id);
    uniqueIds.push(id);
    indexes.push(idx);
    if (idx < topIndex) {
      topIndex = idx;
      topId = id;
    }
  }

  if (uniqueIds.length === 0) {
    state.firstSelectedItemId = undefined;
    state.firstSelectedItemIndex = undefined;
    state.topSelectedItemId = undefined;
    state.topSelectedItemIndex = undefined;
    state.selectedItemIds = [];
    state.selectedItemIndexes = [];
    return;
  }

  state.firstSelectedItemId = uniqueIds[0];
  state.firstSelectedItemIndex = indexes[0];
  state.topSelectedItemId = topId;
  state.topSelectedItemIndex = topIndex === Number.POSITIVE_INFINITY ? undefined : topIndex;
  state.selectedItemIds = uniqueIds;
  state.selectedItemIndexes = indexes;
};

const initialState: TodolistSlice = {
  firstSelectedItemId: 1,
  topSelectedItemId: 1,
  selectedItemIds: [1],
  firstSelectedItemIndex: 0,
  topSelectedItemIndex: 0,
  selectedItemIndexes: [0],
  editingTitle: false,
  listName: '(new TodoList)',
  todoItems: [],
  nextId: 1,
  saved: true,
  status: 'idle',
  canUndo: false,
  canRedo: false,
  pendingFocusId: undefined,
};

const loadItems = (state: Draft<TodolistSlice>, listName: string, items: TodoItem[]): void => {
  state.listName = listName;
  state.todoItems = items;
  if (items.length > 0) {
    applySelection(state, [items[0].id]);
    state.nextId = Math.max(...items.map((item) => item.id)) + 1;
  } else {
    applySelection(state, []);
    state.nextId = 1;
  }
  state.saved = true;
  state.canUndo = false;
  state.canRedo = false;
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
        applySelection(state, [firstId]);
        state.editingTitle = true;
      }
      state.saved = false;
      break;
    }
    case 'deleteItems': {
      const prevSelectedIds = state.selectedItemIds.slice();
      const prevSelectedIndexes = state.selectedItemIndexes.slice();
      applyDeleteItems(state.todoItems, change.ids);
      const idsToDelete = new Set(change.ids);
      const remainingSelected = prevSelectedIds.filter((id) => !idsToDelete.has(id));

      if (remainingSelected.length > 0) {
        applySelection(state, remainingSelected);
      } else if (state.todoItems.length > 0) {
        const fallbackIndexCandidate =
          prevSelectedIndexes.length > 0 ? Math.min(...prevSelectedIndexes) : 0;
        const fallbackIndex = Math.min(
          Math.max(fallbackIndexCandidate, 0),
          state.todoItems.length - 1,
        );
        const fallbackId = state.todoItems[fallbackIndex].id;
        applySelection(state, [fallbackId]);
        state.editingTitle = false;
      } else {
        applySelection(state, []);
        state.editingTitle = false;
      }
      state.saved = false;
      break;
    }
    case 'moveItems': {
      const moved = applyMoveItems(state.todoItems, change.ids, change.direction);
      if (moved) {
        applySelection(state, state.selectedItemIds);
        state.saved = false;
      }
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
    case 'setUndoRedoStatus': {
      state.canUndo = change.canUndo;
      state.canRedo = change.canRedo;
      break;
    }
    default: {
      const _exhaustiveCheck: never = change;
      return _exhaustiveCheck;
    }
  }
};

const applyChangeBatch = (state: Draft<TodolistSlice>, changes: AnyChange[]): void => {
  console.log(`Applying ${changes.length} changes`);
  for (const change of changes) {
    const shouldFocus =
      change.type === 'addItems' &&
      state.pendingFocusId !== undefined &&
      change.items.some(({ item }) => item.id === state.pendingFocusId);
    applySingleChange(state, change, { focusOnFirstAdded: shouldFocus });
    if (shouldFocus) {
      state.pendingFocusId = undefined;
    }
  }
  state.pendingFocusId = undefined;
};

export const todolistSlice = createAppSlice({
  name: 'todolist',
  initialState, // Initial state
  reducers: (create) => ({
    sendAndApplyChange: create.asyncThunk(
      async (payload: AnyChange) => {
        window.api.applyChange(payload);
      },
      {
        pending: (state, action: { meta: { arg: AnyChange } }) => {
          state.status = 'synching';
          if (action.meta.arg.type === 'addItems' && action.meta.arg.items.length > 0) {
            state.pendingFocusId = action.meta.arg.items[0]?.item.id;
          }
        },
        fulfilled: () => {
          // wait for remote push to update state
        },
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
      applySelection(state, [action.payload]);
    }),
    setSelectedItemIds: create.reducer((state, action: { payload: number[] }) => {
      applySelection(state, action.payload);
      if (state.selectedItemIds.length !== 1) {
        state.editingTitle = false;
      }
    }),
    updateItem: create.asyncThunk(
      async (payload: { id: number; newData: Partial<TodoItem> }) => {
        const change: AnyChange = {
          type: 'updateItem',
          id: payload.id,
          newData: payload.newData,
        };
        window.api.applyChange(change);
      },
      {
        pending: (state) => {
          state.status = 'synching';
        },
        fulfilled: () => {
          // remote push will update store
        },
        rejected: (state) => {
          state.status = 'failed';
          console.error('Change failed');
        },
      },
    ),
    setTodoItems: create.reducer(
      (state, action: { payload: { listName: string; items: TodoItem[] } }) => {
        loadItems(state, action.payload.listName, action.payload.items);
      },
    ),
    undo: create.asyncThunk(
      async () => {
        window.api.undo();
      },
      {
        pending: (state) => {
          state.status = 'synching';
          console.log('Undoing...');
        },
        fulfilled: () => {
          // status reset when remote changes arrive
        },
        rejected: (state) => {
          state.status = 'failed';
          console.error('Undo failed');
        },
      },
    ),
    redo: create.asyncThunk(
      async () => {
        window.api.redo();
      },
      {
        pending: (state) => {
          state.status = 'synching';
          console.log('Redoing...');
        },
        fulfilled: () => {
          // status reset when remote changes arrive
        },
        rejected: (state) => {
          state.status = 'failed';
          console.error('Redo failed');
        },
      },
    ),
    applyRemoteChanges: create.reducer((state, action: { payload: AnyChange[] }) => {
      state.status = 'idle';
      applyChangeBatch(state, action.payload);
    }),
  }),
  selectors: {
    getEditingTitle: (state) => state.editingTitle,
    getItems: (state) => state.todoItems,
    getNextId: (state) => state.nextId,
    getFirstSelectedItemId: (state) => state.firstSelectedItemId,
    getTopSelectedItemId: (state) => state.topSelectedItemId,
    getSelectedItemIds: (state) => state.selectedItemIds,
    getFirstSelectedItemIndex: (state) => state.firstSelectedItemIndex,
    getTopSelectedItemIndex: (state) => state.topSelectedItemIndex,
    getSelectedItemIndexes: (state) => state.selectedItemIndexes,
    getCanUndo: (state) => state.canUndo,
    getCanRedo: (state) => state.canRedo,
  },
});
export const {
  sendAndApplyChange,
  updateItem,
  setSelectedItemId,
  setSelectedItemIds,
  setEditingTitle,
  undo,
  redo,
  applyRemoteChanges,
} = todolistSlice.actions;

export const {
  getEditingTitle,
  getItems,
  getNextId,
  getFirstSelectedItemId,
  getTopSelectedItemId,
  getSelectedItemIds,
  getFirstSelectedItemIndex,
  getTopSelectedItemIndex,
  getSelectedItemIndexes,
  getCanUndo,
  getCanRedo,
} = todolistSlice.selectors;

export const { load, save } = todolistSlice.actions;
