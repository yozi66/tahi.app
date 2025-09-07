import { createWithEqualityFn } from 'zustand/traditional';
import { immer } from 'zustand/middleware/immer';

type TitlesMap = Record<number, string>;
type CommentsMap = Record<number, string>;

type TodolistUIState = {
  titles: TitlesMap;
  comments: CommentsMap;
  // Title editing buffer
  initTitle: (id: number, initial: string) => void;
  setTitle: (id: number, value: string) => void;
  clearTitle: (id: number) => void;
  // Comments editing buffer
  initComments: (id: number, initial: string) => void;
  setComments: (id: number, value: string) => void;
  clearComments: (id: number) => void;
};

export const useTodolistUIStore = createWithEqualityFn<TodolistUIState>()(
  immer((set) => ({
    titles: {},
    comments: {},
    initTitle: (id, initial) =>
      set((state) => {
        state.titles[id] = initial;
      }),
    setTitle: (id, value) =>
      set((state) => {
        state.titles[id] = value;
      }),
    clearTitle: (id) =>
      set((state) => {
        delete state.titles[id];
      }),
    initComments: (id, initial) =>
      set((state) => {
        state.comments[id] = initial;
      }),
    setComments: (id, value) =>
      set((state) => {
        state.comments[id] = value;
      }),
    clearComments: (id) =>
      set((state) => {
        delete state.comments[id];
      }),
  })),
);
