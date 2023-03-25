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
      // if (newMessages.length > 0) {
      //    setIsFirstLoading(false);
      // }
      // } else {
      // snap?.docChanges().forEach((doc) => {
      //    if (doc.type === "added") {
      //       const NewFBMessage = {
      //          ...doc.doc.data(),
      //          id: doc.doc.id,
      //       } as FBMessage;
      //       const NewMessage = MessageConverter.convertFromApi(NewFBMessage);
      //       setMessages((prev) => [...prev, NewMessage]);
      //    }
      // });
      // }
      // return () => {
      //    setIsFirstLoading(true);
      // };
   }, [snap]);

   return { messages, loading, error };
};
