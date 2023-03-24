import { useEffect, useState } from "react";

import { getDataById } from "../../api";
import { getAllDataWithFilter } from "../../api/queries/getAllDataWIthFilter";
import type { ChatPreview, FBChat, Group } from "../../typings";
import { DB_PATHS } from "../../typings/enums";
import { QUERIES } from "../../utils";

export const useChats = (disciplineId: string) => {
   const [chats, setChats] = useState<ChatPreview[]>([]);
   const [loading, setLoading] = useState<boolean>(false);

   useEffect(() => {
      const getData = async () => {
         setLoading(true);
         const q = QUERIES.CREATE_SIMPLE_QUERY<FBChat>(DB_PATHS.CHATS, {
            fieldName: "discipline_id",
            fieldValue: disciplineId,
            opStr: "==",
         });
         const snap = await getAllDataWithFilter<FBChat>(q);
         const DBChats: ChatPreview[] = await Promise.all(
            snap.map(async (chat) => {
               const group = await getDataById<Group>(chat.group_id, DB_PATHS.GROUPS);
               return {
                  id: chat.id, // chatId -> id
                  groupId: chat.group_id,
                  groupName: group.name,
               };
            }),
         );
         setChats(DBChats);
         setLoading(false);
      };
      getData();
   }, [disciplineId]);

   return { chats, loading };
};
