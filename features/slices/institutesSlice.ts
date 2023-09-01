/* eslint-disable no-param-reassign */
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import { RootState } from "../../store";
import { FBInstitute } from "../../typings";

interface InitialState {
   institutes: FBInstitute[];
}

const initialState: InitialState = {
   institutes: [],
};

export const institutesSlice = createSlice({
   name: "institutes",
   initialState,
   reducers: {
      setInstitutes: (state, action: PayloadAction<{ institutes: FBInstitute[] }>) => {
         state.institutes = action.payload.institutes;
      },
   },
});

export const selectInstitutes = (state: RootState) => state.institutes.institutes;

// Action creators are generated for each case reducer function
export const { setInstitutes } = institutesSlice.actions;

export default institutesSlice.reducer;
