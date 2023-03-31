import { useCallback, useEffect, useMemo, useState } from "react";

import { addDoc } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";

import { getDataById } from "../../api";
import { getAllDataWithFilter } from "../../api/queries/getAllDataWIthFilter";
import { RootState } from "../../store";
import type { ChatPreview, FBChat, Group } from "../../typings";
import { DB_PATHS, USER_TYPE } from "../../typings/enums";
import { ChatConverter, QUERIES, createCollection } from "../../utils";
import { isEmpty } from "../../utils/isEmpty";
import { selectChatWithDisciplineId, setChat } from "../slices/chatsSlice";
import { selectUser } from "../slices/userSlice";

export const useChat = (disciplineId: string) => {
   const dispatch = useDispatch();

   const rawChatSelector = useCallback(
      (s: RootState) => selectChatWithDisciplineId(s, disciplineId),
      [disciplineId],
   );

   const rawChat = useSelector(rawChatSelector);

   const user = useSelector(selectUser);

   const [loading, setLoading] = useState<boolean>(false);

   const createNewChat = useCallback(
      async (active: boolean, groupId: string) => {
         const chat: FBChat = {
            discipline_id: disciplineId,
            group_id: groupId,
         };

         await addDoc(createCollection(DB_PATHS.CHATS), {
            ...chat,
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

            dispatch(setChat({ chat: chatPreview, disciplineId }));
         });
      },
      [disciplineId, dispatch],
   );

   const loadExistingChat = useCallback(
      async (active: boolean, chat: FBChat) => {
         const previewChat = ChatConverter.toData(chat);
         const group = await getDataById<Group>(previewChat.groupId, DB_PATHS.GROUPS);
         if (!active) return;

         const chatPreview: ChatPreview = {
            id: previewChat.id,
            groupId: previewChat.groupId,
            groupName: group.name,
         };

         dispatch(setChat({ chat: chatPreview, disciplineId }));
      },
      [disciplineId, dispatch],
   );

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
            const chat = await getAllDataWithFilter<FBChat>(q);

            if (!isEmpty(rawChat)) {
               setLoading(false);
               return;
            }

            if (isEmpty(chat)) {
               // если чат еще не создан, создаем новый чат...
               createNewChat(active, user.groupId);
            } else {
               // если чат уже создан
               loadExistingChat(active, chat[0]);
            }

            setLoading(false);
         }
      };
      getData();

      return () => {
         active = false;
      };

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
   }, [createNewChat, disciplineId, loadExistingChat, rawChat, user.groupId, user.type]);

   return useMemo(() => {
      const chat = rawChat || null;
      return {
         chat,
         loading,
      };
   }, [loading, rawChat]);
};
