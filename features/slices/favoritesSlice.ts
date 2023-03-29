/* eslint-disable no-param-reassign */
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { RootState } from "../../store";
import { FBMaterial } from "../../typings";

export interface UserState {
   // по id дисциплины храним материалы
   favorites: FBMaterial[];
}

const initialState: UserState = {
   favorites: [],
};

export const favoritesSlice = createSlice({
   name: "favorites",
   initialState,
   reducers: {
      setFavorites: (state, action: PayloadAction<{ favorites: FBMaterial[] }>) => {
         state.favorites = action.payload.favorites;
      },
   },
});

export const selectFavorites = (state: RootState) => state.favorites.favorites;

// Action creators are generated for each case reducer function
export const { setFavorites } = favoritesSlice.actions;

export default favoritesSlice.reducer;
