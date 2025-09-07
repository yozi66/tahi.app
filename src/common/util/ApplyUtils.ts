import { TodoItem } from '@common/types/TodoItem';
import type { Draft } from 'immer';
// Shared helpers for applying add/delete changes on TodoItem arrays in-place.

export const applyAddItems = (
  items: Draft<TodoItem[]>, // works with both TodoItem[] and Immer Draft<TodoItem[]>
  itemsWithIndex: { item: TodoItem; index: number }[],
): void => {
  if (itemsWithIndex.length === 0) {
    console.log('applyAddItems: nothing to add');
    return;
  }
  // Remove any additions with IDs that already exist in the current list
  // and de-duplicate within the incoming batch. Operates in-place for speed.
  console.log(`applyAddItems: adding ${itemsWithIndex.length} items`);
  const existingIds = new Set<number>();
  for (let i = 0; i < items.length; i++) {
    existingIds.add(items[i].id);
  }
  let write = 0;
  for (let read = 0; read < itemsWithIndex.length; read++) {
    const entry = itemsWithIndex[read];
    if (existingIds.has(entry.item.id)) {
      console.warn(`applyAddItems: duplicate id ${entry.item.id} at ${entry.index}, skipping`);
      continue;
    }
    existingIds.add(entry.item.id);
    if (write !== read) {
      itemsWithIndex[write] = entry;
    }
    write++;
  }
  if (write === 0) {
    console.log('applyAddItems: all items were duplicates, nothing to add');
    return;
  }
  if (write < itemsWithIndex.length) {
    itemsWithIndex.length = write;
  }
  // Sort by index to ensure correct insertion order
  itemsWithIndex.sort((a, b) => a.index - b.index);
  for (const { item, index } of itemsWithIndex) {
    if (index < 0 || index > items.length) {
      console.warn(`applyAddItems: index ${index} out of bounds, appending instead`);
      items.push(item);
    } else {
      items.splice(index, 0, item);
    }
  }
  console.log(`applyAddItems: added ${itemsWithIndex.length} items`);
};

export const applyDeleteItems = (
  items: Draft<TodoItem[]>, // works with both TodoItem[] and Immer Draft<TodoItem[]>
  ids: number[],
): { removed: { item: TodoItem; index: number }[] } => {
  if (ids.length === 0 || items.length === 0) {
    console.log('applyDeleteItems: nothing to remove');
    return { removed: [] };
  }
  const idSet = new Set(ids);
  console.log(`applyDeleteItems: removing ${idSet.size} items`);
  const removed: { item: TodoItem; index: number }[] = [];
  // copy items to front, skipping removed ones
  let write = 0;
  for (let read = 0; read < items.length; read++) {
    const it = items[read];
    if (idSet.has(it.id)) {
      removed.push({ item: it, index: read });
    } else {
      if (write !== read) items[write] = it;
      write++;
    }
  }
  console.log(`applyDeleteItems: removed ${removed.length} items`);
  // remove leftover items at the end
  if (write < items.length) items.length = write;
  return { removed };
};

// Applies a partial update to a single item by id. Returns the previous values
// for the fields that were updated so an undo change can be built easily.
export const applyUpdateItem = (
  items: Draft<TodoItem[]>,
  id: number,
  newData: Partial<TodoItem>,
): { previous?: Partial<TodoItem> } => {
  if (!newData || Object.keys(newData).length === 0) {
    return { previous: undefined };
  }
  const idx = items.findIndex((it) => it.id === id);
  if (idx === -1) {
    console.warn(`applyUpdateItem: item ${id} not found`);
    return { previous: undefined };
  }
  const target = items[idx];
  const previous: Partial<TodoItem> = {};
  // Only allow updates to mutable fields; id is immutable
  if (newData.title !== undefined && target.title !== newData.title) {
    previous.title = target.title;
    target.title = newData.title;
  }
  if (newData.comments !== undefined && target.comments !== newData.comments) {
    previous.comments = target.comments;
    target.comments = newData.comments;
  }
  if (newData.done !== undefined && target.done !== newData.done) {
    previous.done = target.done;
    target.done = newData.done;
  }
  if (Object.keys(previous).length === 0) {
    return { previous: undefined };
  }
  return { previous };
};
