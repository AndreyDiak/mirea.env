/* eslint-disable no-param-reassign */
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import { RootState } from "../../store";
import { FBTeacher } from "../../typings";

export interface UsersState {
   list: FBTeacher[];
}

const initialState: UsersState = {
   list: [],
};

export const searchSlice = createSlice({
   name: "search",
   initialState,
   reducers: {
      setSearchData: (state, action: PayloadAction<FBTeacher[]>) => {
         state.list = action.payload;
      },
   },
});

export const selectTeachers = (state: RootState) => state.search.list;

// Action creators are generated for each case reducer function
export const { setSearchData } = searchSlice.actions;

export default searchSlice.reducer;
