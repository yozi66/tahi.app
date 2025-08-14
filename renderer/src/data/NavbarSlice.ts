import { createSlice } from '@reduxjs/toolkit';

export type NavbarSliceState = {
  mobileOpened: boolean;
  desktopOpened: boolean;
};

const initialState: NavbarSliceState = {
  mobileOpened: false,
  desktopOpened: true,
};

export const navbarSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    toggleMobile: (state) => {
      state.mobileOpened = !state.mobileOpened;
    },
    toggleDesktop: (state) => {
      state.desktopOpened = !state.desktopOpened;
    },
  },
  selectors: {
    selectMobileOpened: (state: NavbarSliceState) => state.mobileOpened,
    selectDesktopOpened: (state: NavbarSliceState) => state.desktopOpened,
  },
});

export const { toggleMobile, toggleDesktop } = navbarSlice.actions;
export const { selectMobileOpened, selectDesktopOpened } = navbarSlice.selectors;
export const navbarReducer = navbarSlice.reducer;
