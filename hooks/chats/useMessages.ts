import { orderBy, query } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { DBMessage } from "../../typings";
import { DBQueries } from "../../typings/enums";
import { createCollection } from "../../utils";
export const useMessages = (chatId: string) => {
  const q = query(createCollection(`${DBQueries.CHATS}/${chatId}/messages`), orderBy("timestamp"));
  const [snap, loading, error] = useCollection(q);
  const messages =
    snap?.docs.map(
      (message) =>
        ({
          ...message.data(),
          id: message.id,
        } as DBMessage)
    ) || [];
  return { messages, loading, error };
};
