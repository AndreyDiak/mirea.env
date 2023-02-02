import { selectUser } from "./../../features/userSlice";
import { useSelector } from "react-redux";
import { getAllDataWithFilter } from "./../../api/queries/getAllDataWIthFilter";
import { useEffect, useState } from "react";
import type { Chat, ChatPreview, Group } from "../../typings";
import { DBQueries, UType } from "../../typings/enums";
import { createCollection, QUERIES } from "../../utils";
import { getDataById } from "../../api";
import { addDoc } from "firebase/firestore";

export const useChat = (disciplineId: string) => {
  const user = useSelector(selectUser);
  const [chat, setChat] = useState<ChatPreview>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getData = async () => {
      if (user.type === UType.STUDENT) {
        setLoading(true);
        let chat: ChatPreview = null;
        const q = QUERIES.CREATE_MULTIPLE_QUERY<Chat>(DBQueries.CHATS, [
          {
            fieldName: "disciplineId",
            fieldValue: disciplineId,
            opStr: "==",
          },
          {
            fieldName: "groupId",
            fieldValue: user.groupId,
            opStr: "==",
          },
        ]);
        const DBchat = await getAllDataWithFilter<Chat>(q);

        if (DBchat.length > 0) {
          chat = {
            id: DBchat[0].id,
            groupId: DBchat[0].groupId,
            groupName: "",
          };
        } else {
          // создаем новый чат...
          await addDoc(createCollection(DBQueries.CHATS), {
            disciplineId,
            groupId: user.groupId,
          }).then(async (res) => {
            const chatId = res.id;
            const DBchat = await getDataById<Chat>(chatId, DBQueries.CHATS);
            chat = {
              id: chatId,
              groupId: DBchat.groupId,
              groupName: "",
            };
          });
        }

        const groupName = await getDataById<Group>(chat.groupId, DBQueries.GROUPS);
        chat.groupName = groupName.name;
        setChat(chat);
        setLoading(false);
      }
    };
    getData();
  }, []);

  return { chat, loading };
};
