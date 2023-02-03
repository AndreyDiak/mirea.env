import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { SuperUser } from "../typings";

export interface UserState {
  user: SuperUser | null;
}

const initialState: UserState = {
  user: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<SuperUser | null>) => {
      state.user = action.payload;
    },
  },
});

export const selectUser = (state: RootState) => state.user.user;

export const selectUserTheme = (state: RootState) => state.user.user.theme;

// Action creators are generated for each case reducer function
export const { setUser } = userSlice.actions;

export default userSlice.reducer;
