import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import paperReducer from 'src/features/paper/paperSlice';

export const store = configureStore({
  reducer: {
    paper: paperReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
