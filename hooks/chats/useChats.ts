import { useEffect, useState } from "react";

import { getDataById } from "../../api";
import { getAllDataWithFilter } from "../../api/queries/getAllDataWIthFilter";
import type { Chat, ChatPreview, Group } from "../../typings";
import { DBQueries } from "../../typings/enums";
import { QUERIES } from "../../utils";

export const useChats = (disciplineId: string) => {
   const [chats, setChats] = useState<ChatPreview[]>([]);
   const [loading, setLoading] = useState<boolean>(false);

   useEffect(() => {
      const getData = async () => {
         setLoading(true);
         const q = QUERIES.CREATE_SIMPLE_QUERY<Chat>(DBQueries.CHATS, {
            fieldName: "disciplineId",
            fieldValue: disciplineId,
            opStr: "==",
         });
         const snap = await getAllDataWithFilter<Chat>(q);
         const DBChats: ChatPreview[] = await Promise.all(
            snap.map(async (chat) => {
               const group = await getDataById<Group>(chat.groupId, DBQueries.GROUPS);
               return {
                  id: chat.id, // chatId -> id
                  groupId: chat.groupId,
                  groupName: group.name,
                  // disciplineId -> delete
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
