import { addDoc, serverTimestamp } from "firebase/firestore";

import { Message, NewMessage, Timestamp } from "../../../typings";
import { DB_PATHS } from "../../../typings/enums";
import { MessagePatcher, createCollection } from "../../../utils";

export const addMessage = async (chatId: string, message: NewMessage) => {
   const fbmessage: Message = {
      ...message,
      id: "", // заглушка для того чтобы не ругались типы, этот id никуда не прорастает
      timestamp: serverTimestamp() as unknown as Timestamp,
   };
   // TODO @raymix менять путь
   await addDoc(createCollection(`${DB_PATHS.CHATS}/${chatId}/messages`), {
      ...MessagePatcher.toApiData(fbmessage),
   });
};
