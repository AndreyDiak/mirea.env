import { useEffect, useState } from "react";

import { orderBy, query } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

import { DB_PATHS, FBMessage, Message } from "../../typings";
import { MessageConverter, createCollection } from "../../utils";

export const useMessages = (chatId: string) => {
   const q = query(createCollection(`${DB_PATHS.CHATS}/${chatId}/messages`), orderBy("timestamp"));

   const [messages, setMessages] = useState<Message[]>([]);

   const [snap, loading, error] = useCollection(q);

   useEffect(() => {
      // if (isFirstLoading) {
      const FBMessages =
         snap?.docs.map(
            (message) =>
               ({
                  ...message.data(),
                  id: message.id,
               } as FBMessage),
         ) || [];

      const newMessages: Message[] = MessageConverter.toData(FBMessages);
      setMessages(newMessages);
   }, [snap]);

   return { messages, loading, error };
};
