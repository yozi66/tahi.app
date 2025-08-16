import { ElectronAPI } from '@electron-toolkit/preload';

// Define the types for your custom APIs here
interface TahiApi {
  getVersions: () => Promise<NodeJS.ProcessVersions>;
  ping: () => void;
  save: () => Promise<{ success: boolean }>;
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
