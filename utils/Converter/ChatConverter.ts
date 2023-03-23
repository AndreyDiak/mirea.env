import { Chat, FBChat } from "../../typings";

export class ChatConverter {
   public static toData(chat: FBChat): Chat {
      return {
         id: chat.id,
         disciplineId: chat.discipline_id,
         groupId: chat.group_id,
      };
   }
}
