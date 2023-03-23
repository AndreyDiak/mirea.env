import { useEffect, useState } from "react";

import { addDoc } from "firebase/firestore";
import { useSelector } from "react-redux";

import { getDataById } from "../../api";
import { getAllDataWithFilter } from "../../api/queries/getAllDataWIthFilter";
import { selectUser } from "../../features/userSlice";
import type { Chat, ChatPreview, Group } from "../../typings";
import { DB_PATHS, USER_TYPE } from "../../typings/enums";
import { QUERIES, createCollection } from "../../utils";

export const useChat = (disciplineId: string) => {
   const user = useSelector(selectUser);
   const [chat, setChat] = useState<ChatPreview>(null);
   const [loading, setLoading] = useState<boolean>(false);

   useEffect(() => {
      const getData = async () => {
         if (user.type === USER_TYPE.STUDENT) {
            setLoading(true);
            // eslint-disable-next-line @typescript-eslint/no-shadow
            let chat: ChatPreview = null;
            const q = QUERIES.CREATE_MULTIPLE_QUERY<Chat>(DB_PATHS.CHATS, [
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
               await addDoc(createCollection(DB_PATHS.CHATS), {
                  disciplineId,
                  groupId: user.groupId,
               }).then(async (res) => {
                  const chatId = res.id;
                  const NewDBchat = await getDataById<Chat>(chatId, DB_PATHS.CHATS);
                  chat = {
                     id: chatId,
                     groupId: NewDBchat.groupId,
                     groupName: "",
                  };
               });
            }

            const groupName = await getDataById<Group>(chat.groupId, DB_PATHS.GROUPS);
            chat.groupName = groupName.name;
            setChat(chat);
            setLoading(false);
         }
      };
      getData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   return { chat, loading };
};
