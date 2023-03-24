import { addDoc, serverTimestamp } from "firebase/firestore";

import { Message, Timestamp } from "../../../typings";
import { DB_PATHS } from "../../../typings/enums";
import { MessagePatcher, createCollection } from "../../../utils";

export const addMessage = async (chatId: string, message: Omit<Message, "timestamp" | "id">) => {
   const fbmessage: Message = {
      ...message,
      id: "", // заглушка для того чтобы не ругались типы, этот id никуда не прорастает
      timestamp: serverTimestamp() as unknown as Timestamp,
   };
   await addDoc(createCollection(`${DB_PATHS.CHATS}/${chatId}/messages`), {
      ...MessagePatcher.toApiData(fbmessage),
   });
};
