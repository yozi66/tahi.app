import { ElectronAPI } from '@electron-toolkit/preload';
import { TodoItem } from '@common/types/TodoItem';

// Define the types for your custom APIs here
interface TahiApi {
  getVersions: () => Promise<NodeJS.ProcessVersions>;
  ping: () => void;
  load: () => Promise<{ success: boolean; listName: string; items: TodoItem[] }>;
  save: (list: TodoItem[], saveAs?: boolean) => Promise<{ success: boolean; listName?: string }>;
  get_list: () => Promise<TodoItem[]>;
  onPushList: (callback: (listName: string, todoList: TodoItem[]) => void) => void;
  // planned: onPushChanges: (callback: (changes: TodoChange[]) => void) => void;
  // Add other custom API methods here
  // For example:
  // saveSettings: (settings: any) => void;
}

declare global {
  interface Window {
    electron: ElectronAPI;
    api: TahiApi;
  }
}
