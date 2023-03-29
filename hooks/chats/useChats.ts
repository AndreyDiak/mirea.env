import { useCallback, useEffect, useMemo, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { getDataById } from "../../api";
import { getAllDataWithFilter } from "../../api/queries";
import { selectChatsWithDisciplineId, setChats } from "../../features/slices/chatsSlice";
import { RootState } from "../../store";
import type { ChatPreview, FBChat, Group } from "../../typings";
import { DB_PATHS } from "../../typings/enums";
import { QUERIES } from "../../utils";
import { isEmpty } from "../../utils/isEmpty";

interface UseChats {
   chats: ChatPreview[];
   loading: boolean;
}

export function useChats(disciplineId: string): UseChats {
   const dispatch = useDispatch();

   const rawChatsSelector = useCallback(
      (s: RootState) => selectChatsWithDisciplineId(s, disciplineId),
      [disciplineId],
   );
   const rawChats = useSelector(rawChatsSelector);

   const [loading, setLoading] = useState<boolean>(false);

   const loadChats = useCallback(async () => {
      const q = QUERIES.CREATE_SIMPLE_QUERY<FBChat>(DB_PATHS.CHATS, {
         fieldName: "discipline_id",
         fieldValue: disciplineId,
         opStr: "==",
      });
      const snap = await getAllDataWithFilter<FBChat>(q);
      const chats: ChatPreview[] = await Promise.all(
         snap.map(async (chat) => {
            const group = await getDataById<Group>(chat.group_id, DB_PATHS.GROUPS);
            return {
               id: chat.id, // chatId -> id
               groupId: chat.group_id,
               groupName: group.name,
            };
         }),
      );
      dispatch(setChats({ chats, disciplineId }));
   }, [disciplineId, dispatch]);

   useEffect(() => {
      if (isEmpty(rawChats)) {
         setLoading(true);
         loadChats();
         setLoading(false);
      }
   }, [loadChats, rawChats]);

   return useMemo(() => {
      return {
         chats: rawChats.slice().sort((prev, next) => prev.groupName.localeCompare(next.groupName)),
         loading,
      };
   }, [loading, rawChats]);
}
