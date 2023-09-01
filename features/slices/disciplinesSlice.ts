/* eslint-disable no-param-reassign */
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import { RootState } from "../../store";
import { FBDiscipline } from "../../typings";

interface InitialState {
   disciplines: FBDiscipline[];
}

const initialState: InitialState = {
   disciplines: [],
};

export const disciplinesSlice = createSlice({
   name: "disciplines",
   initialState,
   reducers: {
      setDisciplines: (state, action: PayloadAction<{ disciplines: FBDiscipline[] }>) => {
         state.disciplines = action.payload.disciplines;
      },
   },
});

export const selectDisciplines = (state: RootState) => state.disciplines.disciplines;

// Action creators are generated for each case reducer function
export const { setDisciplines } = disciplinesSlice.actions;

export default disciplinesSlice.reducer;
