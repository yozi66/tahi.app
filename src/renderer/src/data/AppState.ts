import { create } from 'zustand';

export interface AppState {
  mobileOpened: boolean;
  desktopOpened: boolean;
  toggleMobile: () => void;
  toggleDesktop: () => void;
}

export const useAppState = create<AppState>((set) => ({
  mobileOpened: false,
  desktopOpened: true,
  toggleMobile: () => set((state) => ({ mobileOpened: !state.mobileOpened })),
  toggleDesktop: () => set((state) => ({ desktopOpened: !state.desktopOpened })),
}));
