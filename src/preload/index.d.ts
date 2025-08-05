import { ElectronAPI } from '@electron-toolkit/preload'

// Define the types for your custom APIs here
interface IApi {
  getVersions: () => Promise<NodeJS.ProcessVersions>
  // Add other custom API methods here
  // For example:
  // saveSettings: (settings: any) => void;
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: IApi
  }
}
