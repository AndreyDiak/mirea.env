import { Comment, FBComment } from "../../typings";

export class CommentPatcher {
   public static toApiData(chat: Comment): FBComment {
      return {
         text: chat.text,
         timestamp: chat.timestamp,
         owner_email: chat.ownerEmail,
         material_id: chat.materialId,
      };
   }
}
