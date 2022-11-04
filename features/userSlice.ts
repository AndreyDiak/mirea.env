import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'

export interface CounterState {
  user: SuperUser | null
  notifiications: Notification[]
}

const initialState: CounterState = {
  user: null,
  notifiications: []
}

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Teacher | Student | null>) => {
      state.user = action.payload;
    },
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifiications = action.payload
    },
    setTheme: (state, action: PayloadAction<AppTheme>) => {
      // @ts-ignore
      state.user = {
        ...state.user,
        theme: action.payload
      }
    }
  },
})
// @ts-ignore
export const getUser = (state : RootState) => state.userPage.user;
export const getNotifications = (state: RootState) => state.userPage.notifiications;

// Action creators are generated for each case reducer function
export const { setUser, setNotifications, setTheme } = counterSlice.actions

export default counterSlice.reducer