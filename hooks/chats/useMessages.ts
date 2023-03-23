import { orderBy, query } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

import { Message } from "../../typings";
import { DB_PATHS } from "../../typings/enums";
import { createCollection } from "../../utils";

export const useMessages = (chatId: string) => {
   const q = query(createCollection(`${DB_PATHS.CHATS}/${chatId}/messages`), orderBy("timestamp"));
   const [snap, loading, error] = useCollection(q);
   const messages =
      snap?.docs.map(
         (message) =>
            ({
               ...message.data(),
               id: message.id,
            } as Message),
      ) || [];
   return { messages, loading, error };
};
