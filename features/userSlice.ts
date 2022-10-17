import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'

export interface CounterState {
  user: null | Student | Teacher
}

const initialState: CounterState = {
  user: null,
}

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Teacher | Student | null>) => {
      state.user = action.payload;
    }
  },
})
// @ts-ignore
export const getUser = (state : RootState) => state.userPage.user;

// Action creators are generated for each case reducer function
export const { setUser } = counterSlice.actions

export default counterSlice.reducer