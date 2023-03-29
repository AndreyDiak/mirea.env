import { configureStore } from "@reduxjs/toolkit";

import authSlice from "./features/slices/authSlice";
import chatsSlice from "./features/slices/chatsSlice";
import commentsSlice from "./features/slices/commentsSlice";
import disciplinesSlice from "./features/slices/disciplinesSlice";
import favoritesSlice from "./features/slices/favoritesSlice";
import materialsSlice from "./features/slices/materialsSlice";
import messagesSlice from "./features/slices/messagesSlice";
import userSlice from "./features/slices/userSlice";

export const store = configureStore({
   reducer: {
      user: userSlice,
      auth: authSlice,
      disciplines: disciplinesSlice,
      materials: materialsSlice,
      comments: commentsSlice,
      favorites: favoritesSlice,
      chats: chatsSlice,
      messages: messagesSlice,
   },
   middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
         // Нужно для того, чтобы отключить проверку на Timestamp
         serializableCheck: false,
      }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
