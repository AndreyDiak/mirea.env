/* eslint-disable no-param-reassign */
import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";

import { RootState } from "../../store";
import { ChatPreview } from "../../typings";

interface InitialState {
   // по id дисциплины храним материалы
   chats: Record<string, ChatPreview[]>;
}

const initialState: InitialState = {
   chats: {},
};

export const chatsSlice = createSlice({
   name: "chats",
   initialState,
   reducers: {
      setChats: (state, action: PayloadAction<{ chats: ChatPreview[]; disciplineId: string }>) => {
         const { chats, disciplineId } = action.payload;
         state.chats[disciplineId] = chats;
      },
      setChat: (state, action: PayloadAction<{ chat: ChatPreview; disciplineId: string }>) => {
         const { chat, disciplineId } = action.payload;
         state.chats[disciplineId] = [chat];
      },
   },
});

const selectChats = (state: RootState) => state.chats.chats;

export const selectChatsWithDisciplineId = createSelector(
   (_: RootState, disciplineId: string) => disciplineId,
   selectChats,
   (disciplineId, chats) => chats[disciplineId] ?? [],
);

export const selectChatWithDisciplineId = createSelector(
   (s: RootState, disciplineId: string) => disciplineId,
   selectChats,
   (disciplineId, chats) => (chats[disciplineId] ? chats[disciplineId][0] : {}) as ChatPreview,
);

// Action creators are generated for each case reducer function
export const { setChats, setChat } = chatsSlice.actions;

export default chatsSlice.reducer;
