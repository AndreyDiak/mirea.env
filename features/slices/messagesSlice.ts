/* eslint-disable no-param-reassign */
import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";

import { RootState } from "../../store";
import { FBMessage } from "../../typings";

interface InitialState {
   // по id чата храним сообщения
   messages: Record<string, FBMessage[]>;
}

const initialState: InitialState = {
   messages: {},
};

export const messagesSlice = createSlice({
   name: "messages",
   initialState,
   reducers: {
      setMessages: (state, action: PayloadAction<{ messages: FBMessage[]; chatId: string }>) => {
         const { chatId } = action.payload;
         state.messages[chatId] = action.payload.messages;
      },
   },
});

export const selectMessages = (state: RootState) => state.messages.messages;

export const selectMessagesWithChatId = createSelector(
   (s: RootState, chatId: string) => chatId,
   selectMessages,
   (chatId, messages) => messages[chatId] ?? [],
);

// Action creators are generated for each case reducer function
export const { setMessages } = messagesSlice.actions;

export default messagesSlice.reducer;
