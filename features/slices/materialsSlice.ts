/* eslint-disable no-param-reassign */
import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";

import { RootState } from "../../store";
import { FBMaterial } from "../../typings";

export interface UserState {
   // по id дисциплины храним материалы
   materials: Record<string, FBMaterial[]>;
}

const initialState: UserState = {
   materials: {},
};

export const materialsSlice = createSlice({
   name: "materials",
   initialState,
   reducers: {
      setMaterials: (state, action: PayloadAction<{ materials: FBMaterial[]; disciplineId: string }>) => {
         const { disciplineId } = action.payload;
         state.materials[disciplineId] = action.payload.materials;
      },
   },
});

const selectMaterials = (state: RootState) => state.materials.materials;

export const selectMaterialsByDisciplineId = createSelector(
   (s: RootState, disciplineId: string) => disciplineId,
   selectMaterials,
   (disciplineId, materials) => materials[disciplineId] ?? [],
);

// Action creators are generated for each case reducer function
export const { setMaterials } = materialsSlice.actions;

export default materialsSlice.reducer;
