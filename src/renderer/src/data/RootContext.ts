// This is the old part using react context (to be replaced by Redux)

import { createContext } from 'react';
import { EditorState } from './EditorState';
import { sampleState } from './TodoData';

export const TodoContext = createContext<{
  tahiState: EditorState;
  setTahiState: React.Dispatch<React.SetStateAction<EditorState>>;
}>({ tahiState: sampleState, setTahiState: () => {} });

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
