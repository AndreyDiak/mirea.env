import { useCallback, useEffect, useState } from "react";

import { addDoc } from "firebase/firestore";
import { useSelector } from "react-redux";

import { getDataById } from "../../api";
import { getAllDataWithFilter } from "../../api/queries/getAllDataWIthFilter";
import { selectUser } from "../../features/slices/userSlice";
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
                  ...newChat,
               }).then(async (res) => {
                  const chatId = res.id;
                  const NewFbChat = await getDataById<FBChat>(chatId, DB_PATHS.CHATS);
                  const newPreviewChat = ChatConverter.toData(NewFbChat);
                  const group = await getDataById<Group>(newPreviewChat.groupId, DB_PATHS.GROUPS);
                  if (!active) return;

                  const chatPreview: ChatPreview = {
                     id: newPreviewChat.id,
                     groupId: newPreviewChat.groupId,
                     groupName: group.name,
                  };

                  setChat(chatPreview);
               });
            } else {
               // если чат уже создан

               const previewChat = ChatConverter.toData(FBChat[0]);
               const group = await getDataById<Group>(previewChat.groupId, DB_PATHS.GROUPS);
               if (!active) return;

               const chatPreview: ChatPreview = {
                  id: previewChat.id,
                  groupId: previewChat.groupId,
                  groupName: group.name,
               };
               setChat(chatPreview);
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
