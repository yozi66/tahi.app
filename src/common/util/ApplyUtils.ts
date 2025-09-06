import { TodoItem } from '@common/types/TodoItem';
// Shared pure helpers for applying add/delete changes on TodoItem arrays.
// Non-mutating: callers should reassign the returned array.

export const applyAddItems = (
  items: ReadonlyArray<TodoItem>,
  itemsWithIndex: { item: TodoItem; index: number }[],
): { items: TodoItem[] } => {
  if (itemsWithIndex.length === 0) {
    return { items: items.slice() as TodoItem[] };
  }
  // copy once for speed; splice on the copy
  const out: TodoItem[] = items.slice() as TodoItem[];
  itemsWithIndex
    .slice()
    .sort((a, b) => a.index - b.index)
    .forEach(({ item, index }) => {
      if (index < 0 || index > out.length) {
        out.push(item);
      } else {
        out.splice(index, 0, item);
      }
    });
  return { items: out };
};

export const applyDeleteItems = (
  items: ReadonlyArray<TodoItem>,
  ids: number[],
): { items: TodoItem[]; removed: { item: TodoItem; index: number }[] } => {
  if (ids.length === 0 || items.length === 0) {
    return { items: items.slice() as TodoItem[], removed: [] };
  }
  const idSet = new Set(ids);
  const removed: { item: TodoItem; index: number }[] = [];
  items.forEach((item, index) => {
    if (idSet.has(item.id)) {
      removed.push({ item, index });
    }
  });
  if (removed.length === 0) {
    return { items: items.slice() as TodoItem[], removed };
  }
  const kept = (items as TodoItem[]).filter((item) => !idSet.has(item.id));
  return { items: kept, removed };
};
