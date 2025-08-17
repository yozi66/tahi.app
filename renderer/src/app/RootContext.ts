import { combineSlices, configureStore } from '@reduxjs/toolkit';
import { navbarSlice } from '@/features/ui/NavbarSlice';
import { todolistSlice } from '@/features/todolist/TodolistSlice';

const rootReducer = combineSlices(navbarSlice, todolistSlice);

export type RootState = ReturnType<typeof rootReducer>;

export const makeStore = (
  preloadedState?: Partial<RootState>,
): ReturnType<typeof configureStore> => {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState,
  });
  return store;
};

export const store = makeStore();

export type AppStore = typeof store;

export type AppDispatch = AppStore['dispatch'];
