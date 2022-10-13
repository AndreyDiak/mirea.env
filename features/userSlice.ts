import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface CounterState {
  user: null | User
}

const initialState: CounterState = {
  user: null,
}

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload
    }
  },
})

export const getUser = (state : CounterState) => state.user;

// Action creators are generated for each case reducer function
export const { setUser } = counterSlice.actions

export default counterSlice.reducer