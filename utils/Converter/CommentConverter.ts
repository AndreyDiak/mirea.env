import { Comment, FBComment } from "../../typings";

export class CommentConverter {
   public static toData(chat: FBComment): Comment {
      return {
         id: chat.id,
         text: chat.text,
         timestamp: chat.timestamp,
         ownerEmail: chat.owner_email,
         materialId: chat.material_id,
      };
   }
}
