import { createAppSlice } from '@renderer/app/createAppSlice';

export type AppSlice = {
  apiCallbacksAdded: boolean;
};

const initialState: AppSlice = {
  apiCallbacksAdded: false,
};

export const appSlice = createAppSlice({
  name: 'app',
  initialState, // Initial state
  reducers: {
    setApiCallbacksAdded: (state, action) => {
      state.apiCallbacksAdded = action.payload;
    },
  },
  selectors: {
    areApiCallbacksAdded: (state: AppSlice) => state.apiCallbacksAdded,
  },
});

export const { setApiCallbacksAdded } = appSlice.actions;
export const { areApiCallbacksAdded } = appSlice.selectors;
