import { useEffect, useState } from "react";

import { addDoc } from "firebase/firestore";
import { useSelector } from "react-redux";

import { getDataById } from "../../api";
import { getAllDataWithFilter } from "../../api/queries/getAllDataWIthFilter";
import { selectUser } from "../../features/userSlice";
import type { ChatPreview, FBChat, Group } from "../../typings";
import { DB_PATHS, USER_TYPE } from "../../typings/enums";
import { ChatConverter, QUERIES, createCollection } from "../../utils";
import { isEmpty } from "../../utils/isEmpty";

export const useChat = (disciplineId: string) => {
   const user = useSelector(selectUser);
   const [chat, setChat] = useState<ChatPreview>(null);
   const [loading, setLoading] = useState<boolean>(false);

   useEffect(() => {
      let active = true;
      const getData = async () => {
         if (user.type === USER_TYPE.STUDENT) {
            setLoading(true);

            const q = QUERIES.CREATE_MULTIPLE_QUERY<FBChat>(DB_PATHS.CHATS, [
               {
                  fieldName: "discipline_id",
                  fieldValue: disciplineId,
                  opStr: "==",
               },
               {
                  fieldName: "group_id",
                  fieldValue: user.groupId,
                  opStr: "==",
               },
            ]);
            const FBChat = await getAllDataWithFilter<FBChat>(q);

            if (isEmpty(FBChat)) {
               // если чат еще не создан, создаем новый чат...

               const newChat: FBChat = {
                  discipline_id: disciplineId,
                  group_id: user.groupId,
               };

               await addDoc(createCollection(DB_PATHS.CHATS), {
                  newChat,
               }).then(async (res) => {
                  const chatId = res.id;
                  const NewFbChat = await getDataById<FBChat>(chatId, DB_PATHS.CHATS);
                  const newPreviewChat = ChatConverter.toData(NewFbChat);
                  if (active) {
                     setChat({
                        id: newPreviewChat.id,
                        groupId: newPreviewChat.groupId,
                        groupName: "",
                     });
                  }
               });
            } else {
               // если чат уже создан
               const previewChat = ChatConverter.toData(FBChat[0]);
               if (active) {
                  setChat({
                     id: previewChat.id,
                     groupId: previewChat.groupId,
                     groupName: "",
                  });
               }
            }

            const groupName = await getDataById<Group>(chat.groupId, DB_PATHS.GROUPS);
            if (active) {
               setChat((prev) => ({
                  ...prev,
                  groupName: groupName.name,
               }));
            }
            setLoading(false);
         }
      };
      getData();
      return () => {
         active = false;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   return { chat, loading };
};
