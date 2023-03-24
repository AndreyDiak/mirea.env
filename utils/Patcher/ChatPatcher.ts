import { Chat, FBChat } from "../../typings";

export class ChatPatcher {
   public static toApiData(chat: Chat): FBChat {
      return {
         group_id: chat.groupId,
         discipline_id: chat.disciplineId,
      };
   }
}
