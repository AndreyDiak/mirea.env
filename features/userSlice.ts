/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../store";
import { Student, Teacher } from "../typings";

export interface UserState {
   user: Student | Teacher | null;
}

const initialState: UserState = {
   user: null,
};

export const userSlice = createSlice({
   name: "user",
   initialState,
   reducers: {
      setUser: (state, action: PayloadAction<Student | Teacher | null>) => {
         state.user = action.payload;
      },
   },
});

export const selectUser = (state: RootState) => state.user.user;

export const selectUserId = (state: RootState) => state.user.user.id;

export const selectUserTheme = (state: RootState) => state?.user?.user?.theme;

export const selectUserAppTheme = (state: RootState) => state?.user?.user?.appTheme;

// Action creators are generated for each case reducer function
export const { setUser } = userSlice.actions;

export default userSlice.reducer;
