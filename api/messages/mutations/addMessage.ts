import { addDoc, serverTimestamp } from "firebase/firestore";

import { DBMessage } from "../../../typings";
import { DB_PATHS } from "../../../typings/enums";
import { createCollection } from "../../../utils";

export const addMessage = async (chatId: string, message: Omit<DBMessage, "timestamp" | "id">) => {
   await addDoc(createCollection(`${DB_PATHS.CHATS}/${chatId}/messages`), {
      ...message,
      timestamp: serverTimestamp(),
   });
};