import { useCallback, useEffect, useMemo, useState } from "react";

import { orderBy, query } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { useDispatch, useSelector } from "react-redux";

import { selectMessagesWithChatId, setMessages } from "../../features/slices/messagesSlice";
import { RootState } from "../../store";
import { DB_PATHS, FBMessage, Message } from "../../typings";
import { MessageConverter, createCollection } from "../../utils";
import { deepCompare } from "../../utils/deepCompare";

interface UseMessages {
   messages: Message[];
   loading: boolean;
}

export function useMessages(chatId: string): UseMessages {
   const dispatch = useDispatch();

   const rawMessagesSelector = useCallback((s: RootState) => selectMessagesWithChatId(s, chatId), [chatId]);
   const rawMessages = useSelector(rawMessagesSelector);

   const q = query(createCollection(`${DB_PATHS.CHATS}/${chatId}/messages`), orderBy("timestamp"));

   // const [messages, setMessages] = useState<Message[]>([]);

   const [snap, loading, error] = useCollection(q);

   const loadMessages = useCallback(() => {
      const messages =
         snap?.docs.map(
            (message) =>
               ({
                  ...message.data(),
                  id: message.id,
               } as FBMessage),
         ) ?? [];
      if (!deepCompare(messages, rawMessages)) {
         dispatch(setMessages({ messages, chatId }));
      }
   }, [chatId, dispatch, rawMessages, snap?.docs]);

   useEffect(() => {
      // if (isFirstLoading) {
      if (snap?.docs.length === 0 || loading) return;
      loadMessages();
   }, [loadMessages, loading, snap]);

   return useMemo(() => {
      const newMessages = rawMessages ? MessageConverter.toData(rawMessages) : [];

      return {
         messages: newMessages,
         loading,
      };
   }, [loading, rawMessages]);
}
