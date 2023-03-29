/* eslint-disable no-param-reassign */
import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";

import { RootState } from "../../store";
import { ChatPreview } from "../../typings";

export interface UserState {
   // по id дисциплины храним материалы
   chats: Record<string, ChatPreview[]>;
}

const initialState: UserState = {
   chats: {},
};

export const chatsSlice = createSlice({
   name: "chats",
   initialState,
   reducers: {
      setChats: (state, action: PayloadAction<{ chats: ChatPreview[]; disciplineId: string }>) => {
         const { disciplineId } = action.payload;
         state.chats[disciplineId] = action.payload.chats;
      },
   },
});

const selectChats = (state: RootState) => state.chats.chats;

export const selectChatsWithDisciplineId = createSelector(
   (s: RootState, disciplineId: string) => disciplineId,
   selectChats,
   (disciplineId, chats) => chats[disciplineId] ?? [],
);

// Action creators are generated for each case reducer function
export const { setChats } = chatsSlice.actions;

export default chatsSlice.reducer;
