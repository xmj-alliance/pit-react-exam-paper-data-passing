/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "src/app/store";
import { IAnswerStore } from "src/models/paper";

export interface IPaperState {
  rightAnswerStore: IAnswerStore,
  userAnswerStore: IAnswerStore,
  score: number,
  isUserAnswerSubmitted: boolean,
}

const initialState: IPaperState = {
  rightAnswerStore: {},
  userAnswerStore: {},
  score: 0,
  isUserAnswerSubmitted: false,
};

export const paperSlice = createSlice({
  name: 'paper',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setRightAnswerStore: (state, action: PayloadAction<IAnswerStore>) => {
      // It's components' responsibility to create new object.
      // Bad to modify the "useSelect" value directly from there,
      // so they always create new ones before dispatch().
      state.rightAnswerStore = action.payload;
    },
    setUserAnswerStore: (state, action: PayloadAction<IAnswerStore>) => {
      state.userAnswerStore = action.payload;
    },
    setScore: (state, action: PayloadAction<number>) => {
      state.score = action.payload;
    },
    setIsUserAnswerSubmitted: (state, action: PayloadAction<boolean>) => {
      state.isUserAnswerSubmitted = action.payload;
    },
  },
});

export const {
  setRightAnswerStore, setUserAnswerStore, setScore, setIsUserAnswerSubmitted,
} = paperSlice.actions;
// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectRightAnswerStore = (state: RootState): IAnswerStore => state.paper.rightAnswerStore;
export const selectUserAnswerStore = (state: RootState): IAnswerStore => state.paper.userAnswerStore;
export const selectScore = (state: RootState): number => state.paper.score;
export const selectIsUserAnswerSubmitted = (state: RootState): boolean => state.paper.isUserAnswerSubmitted;

export default paperSlice.reducer;
