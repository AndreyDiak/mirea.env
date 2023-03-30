/* eslint-disable no-param-reassign */
import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";

import { RootState } from "../../store";
import { FBComment } from "../../typings";

interface InitialState {
   // по id дисциплины храним материалы
   comments: Record<string, FBComment[]>;
}

const initialState: InitialState = {
   comments: {},
};

export const commentsSlice = createSlice({
   name: "comments",
   initialState,
   reducers: {
      setComments: (state, action: PayloadAction<{ comments: FBComment[]; materialId: string }>) => {
         const { materialId } = action.payload;
         state.comments[materialId] = action.payload.comments;
      },
   },
});

export const selectComments = (state: RootState) => state.comments.comments;

export const selectCommentsByMaterialId = createSelector(
   (s: RootState, materialId: string) => materialId,
   selectComments,
   (materialId, comments) => comments[materialId] ?? [],
);

// Action creators are generated for each case reducer function
export const { setComments } = commentsSlice.actions;

export default commentsSlice.reducer;
