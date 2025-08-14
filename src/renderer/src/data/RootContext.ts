// This is the old part using react context (to be replaced by Redux)

import { createContext } from 'react';
import { TodolistSlice } from './TodolistSlice';
import { sampleListState } from './sampleListState';

export const TodoContext = createContext<{
  tahiState: TodolistSlice;
  setTahiState: React.Dispatch<React.SetStateAction<TodolistSlice>>;
}>({ tahiState: sampleListState, setTahiState: () => {} });

// this is the new part using Redux

import { combineSlices, configureStore } from '@reduxjs/toolkit';
import { navbarSlice } from './NavbarSlice';

const rootReducer = combineSlices(navbarSlice);

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
