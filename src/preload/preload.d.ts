import { TodoItem } from '@common/types/TodoItem';
import { AnyChange } from '@common/types/AnyChange';

// Define the types for your custom APIs here
interface TahiApi {
  getVersions: () => Promise<NodeJS.ProcessVersions>;
  ping: () => void;
  load: () => Promise<{ success: boolean; listName: string; items: TodoItem[] }>;
  save: (list: TodoItem[], saveAs?: boolean) => Promise<{ success: boolean; listName?: string }>;
  get_list: () => Promise<TodoItem[]>;
  onPushList: (callback: (listName: string, todoList: TodoItem[]) => void) => void;
  applyChange: (change: AnyChange) => Promise<AnyChange[]>;
  undo: () => Promise<AnyChange[]>;
  redo: () => Promise<AnyChange[]>;
  /* planned extension:
  onPushChanges: (callback: (changes: AnyChange[]) => void) => void;
  */
}

declare global {
  interface Window {
    api: TahiApi;
  }
}
